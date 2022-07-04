const authRouter = require("express").Router();
const passport = require('passport');
const { AuthAccount, Userrole } = require("../model/userModel")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


//xử lý sau khi user cho phép xác thực với facebook


authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/users/home' }),
    async function (req, res) {
        // Successful authentication, redirect home.
        console.log("###" + req.user)


        console.log("###user fb" + req.user.facebook);

        // create token if found user 

        const role = await Userrole.findById(req.user.facebook.role)

        const Facebook_tokenAccess = jwt.sign({
            id: req.user.id,
            role: role.name
        }, process.env.JWT_ACCESS_KEY, {
            expiresIn: "1d"
        });

        const full_Facebook_tokenAccess = `Bearer ${Facebook_tokenAccess}`

        console.log("FB_token: " + full_Facebook_tokenAccess)

        //save token to cookie

        res.cookie('facebook_access_token', full_Facebook_tokenAccess, {
            maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống 
            httpOnly: true, // chỉ có http mới đọc được token
            //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
        })

        res.redirect("/api/users/home");

    });

 authRouter.get('/google/callback',
    passport.authenticate('google' , { failureRedirect: '/api/users/home' }),
    async function (req, res) {
        // Successful authentication, redirect home.
        console.log("###" + req.user)


        console.log("###user gg" + req.user.google);

        // create token if found user 

        const role = await Userrole.findById(req.user.google.role)

        const Google_tokenAccess = jwt.sign({
            id: req.user.id,
            role: role.name
        }, process.env.JWT_ACCESS_KEY, {
            expiresIn: "1d"
        });

        const full_Google_tokenAccess = `Bearer ${Google_tokenAccess}`

        console.log("GG_token: " + full_Google_tokenAccess)

        //save token to cookie

        res.cookie('google_access_token', full_Google_tokenAccess, {
            maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống 
            httpOnly: true, // chỉ có http mới đọc được token
            //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
        })

        res.redirect("/api/users/home");

    });


// authRouter.get('/facebook/callback',(req,res) =>{

//     passport.authenticate('facebook', async(req,res) =>{
//         console.log("chay vao router db callback");
//         res.redirect("api/users/home");
//     })

// })



module.exports = authRouter;