// config/passport.js

// load những thứ chúng ta cần
var FacebookStrategy = require('passport-facebook').Strategy;


// load  user model
const {AuthAccount, Userrole}  = require("../model/userModel") 
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


dotenv.config();  



module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        AuthAccount.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
            // điền thông tin để xác thực với Facebook.
            // những thông tin này đã được điền ở file auth.js
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:8000/api/auth/facebook/callback",
            profileFields: ['id','displayName','email','first_name','last_name','middle_name']
        },

        // Facebook sẽ gửi lại chuối token và thông tin profile của user
        function (res,token, refreshToken, profile, done) {

            console.log("profile user FB :" + profile);
            
            // asynchronous
            process.nextTick(function () {
                // tìm trong db xem có user nào đã sử dụng facebook id này chưa
                AuthAccount.findOne({'facebook.id': profile.id}, async (res,err, user) => {
                    if (err)
                        return done(err);

                    // Nếu tìm thấy user, cho họ đăng nhập
                    if (user) {
                        console.log("da tim thay user")
                        console.log(user.facebook);

                        // create token if found user 

                        const role = await Userrole.findById(user.facebook.role._id)

                        const Facebook_tokenAccess = jwt.sign({
                            id: user.id,
                            role: role.name
                        }, process.env.JWT_ACCESS_KEY, {
                            expiresIn: "1d"
                        });
                        
                        console.log("FB_token: " + Facebook_tokenAccess)
                        // save token to cookie

                        res.cookie('facebook_access_token', Facebook_tokenAccess, {
                            maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống 
                            httpOnly: true, // chỉ có http mới đọc được token
                            //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
                        })

                        res.redirect("/api/users/home");

                    } else {
                        // nếu chưa có, tạo mới user
                        const authAccount = new AuthAccount();

                        Iuser = await Userrole.findOne({ name: new RegExp('^' + "user" + '$', "i") });
                       
                        // lưu các thông tin cho user
                        authAccount.facebook.id = profile.id;
                        authAccount.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
                        authAccount.facebook.email = profile.emails[0].value; // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền
                      //  authAccount.facebook.avatar = profile.photos[0].value;
                        authAccount.facebook.role = Iuser._id;
                        // lưu vào db
                       await authAccount.save(function (err) {
                            if (err)
                                throw err;
                            // nếu thành công, trả lại user
                            console.log(authAccount);
                        });
                    }

                });
            });

        }));

};