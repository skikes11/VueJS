const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");

const { UserAccount } = require("../model/userModel");
const { AuthAccount, Userrole } = require("../model/userModel")
router.get("/", async (req, res) => {

    console.log("get in home");
    const token = req.cookies.access_token;

    const facebook_token = req.cookies.facebook_access_token;

    const google_token = req.cookies.google_access_token;

    if (token) {
        const user_token = await middlewareController.verifyTokenAccount(token);

        if (user_token) {
            const user = await UserAccount.findById(user_token.id);

            console.log("token ++" + user);

            if (user) {
                return res.render("userProfile", {
                    user: user
                })
            }
        }
    } else if (facebook_token) {

        const user_facebook_token = await middlewareController.verifyTokenAccount(facebook_token);

        console.log("$$$" + user_facebook_token)

        if (user_facebook_token) {

            console.log("user FB ###" + user_facebook_token)
            const user_facebook = await AuthAccount.findById(user_facebook_token.id)

            if (user_facebook) {
                console.log("token ++" + user_facebook.facebook);
                return res.render("userProfile", {
                    user: user_facebook.facebook
                })
            }
        }
    }else if(google_token){
        const user_google_token = await middlewareController.verifyTokenAccount(google_token);

        console.log("$$$" + user_google_token)

        if (user_google_token) {

            console.log("user GG ###" + user_google_token)
            const user_google = await AuthAccount.findById(user_google_token.id)

            if (user_google) {
                console.log("token ++" + user_google.google);
                return res.render("userProfile", {
                    user: user_google.google
                })
            }
        }
    }

    res.render("index",{
        mess : ""
    });
})

module.exports = router;


