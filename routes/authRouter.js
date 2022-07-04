const authRouter = require("express").Router();
const passport = require('passport');



authRouter.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));



//xử lý sau khi user cho phép xác thực với facebook


authRouter.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/api/users/home',
        failureRedirect: '/api/users/home'
    })
)


// authRouter.get('/facebook/callback',(req,res) =>{

//     passport.authenticate('facebook', async(req,res) =>{
//         console.log("chay vao router db callback");
//         res.redirect("api/users/home");
//     })

// })
    


module.exports = authRouter;