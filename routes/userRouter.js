const userRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");
const userValidate = require("../controllers/validation/userValidateRegister");
const logger = require("../controllers/logger/winstonLogger");
const { UserAccount } = require("../model/userModel");
const { AuthAccount, Userrole } = require("../model/userModel")





//User login View
userRouter.get("/home", async (req, res) => {

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

    res.render("index");
})

//Forgot Password View
userRouter.get("/forgot-password", function (req, res) {
    res.render("forgotPassword", {
        mess: ""
    });
})


//Reset Password Completed View
userRouter.get("/reset-password-completed", function (req, res) {
    res.render("resetPasswordCompleted")
})


// Register View

userRouter.get("/register", function (req, res) {
    res.render("register", { mess: "" });
})


// Reset Password View
userRouter.get("/reset-password", function (req, res) {
    res.render("resetPassword");
})


// Registration complete view


userRouter.get("/registration-completed", function (req, res) {
    res.render("registrationComplete");
})


//Add User 
userRouter.post("/addUser", userController.addUser);

//AddRole
userRouter.post("/r2", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res);
    console.log(user)
    if (!user) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        })
    }

    if (user.role == "admin") {
        userController.addRole(req, res)
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission denied"
        })
    }
});

//Get All User (auth: ADMIN)
userRouter.get("/", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res)
    console.log(user)
    if (!user) {
        logger.info({
            "success": false,
            "message": "did not found any user"
        });
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    if (user.role == "admin") {
        getAllUser(req, res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//Get All Role (auth: ADMIN)
userRouter.get("/r1", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res)
    console.log(user)
    if (!user) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        })
    }

    if (user.role == "admin") {
        userController.getAllRole(req, res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//UPDATE USER BY ID (auth : ADMIN)
userRouter.put("/v2/:id", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res);
    console.log(user);

    if (!user) {
        res.status(401).json({
            "success": false,
            "message": "authentication failed"
        })
    } else {
        if (user.role == "admin") {
            userController.UpdateUserByID(req, res, req.params.id);
        } else {
            res.status(403).json({
                "success": false,
                "message": "Authorization failed"
            })
        }
    }
});

//LOG OUT
userRouter.get("/logout", async (req, res) => {

    res.clearCookie('access_token');
    res.clearCookie('facebook_access_token');
    res.clearCookie('google_access_token');
    res.redirect('./home')

});

//Load Profile Update
userRouter.get("/loadUpdate", async (req, res) => {

    const token = req.cookies.access_token;

    const token_FB = req.cookies.facebook_access_token;

    if (!token && !token_FB) {
        return res.status(403).json({
            mess: "invalid token access"
        })
    }

    if (token) {
        const user_token = await middlewareController.verifyTokenAccount(token);

        const user = await UserAccount.findById(user_token.id)

        if (!user) {
            return res.status(403).json({
                mess: "invalid token access"
            })
        } else {
            res.render("updateUser", {
                user: user,
                mess: ""
            })
        }
    }else if( token_FB){
        const user_FB_Token = await middlewareController.verifyTokenAccount(token_FB);

        const user_FB = await AuthAccount.findById(user_FB_Token.id)

        if (!user_FB) {
            return res.status(403).json({
                mess: "invalid token access"
            })
        } else {
            res.render("updateUser", {
                user: user_FB.facebook,
                mess: ""
            })
        }

    }

});

//UPDATE USER BY TOKEN
userRouter.post("/update", middlewareController.uploadFileImage().single("avatar"), async (req, res) => {
    const token = req.cookies.access_token;

    const token_FB = req.cookies.facebook_access_token;

    if (!token && !token_FB) {
        return res.status(403).json({
            mess: "invalid token access"
        })
    }

    if (token) {
        const user = await middlewareController.verifyTokenAccount(token);
        console.log(user);
        if (user) {
            userController.UpdateUserByToken(req, res, user.id, 0);   // CheckAuth : 0 - local, 1 - Facebook, 2 - Google
        } else {
            res.status(401).json({
                "success": false,
                "message": "authentication fail"
            })
        }
    } else if (token_FB) {

        const user_FB = await middlewareController.verifyTokenAccount(token_FB);
        console.log(user_FB);
        if (user_FB) {
            userController.UpdateUserByToken(req, res, user_FB.id, 1);
        } else {
            res.status(401).json({
                "success": false,
                "message": "authentication fail"
            })
        }


    }
});
//DELETE USER BY ID (auth: ADMIN)
userRouter.delete("/:id", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res);
    console.log(user);

    if (!user) {
        res.status(401).json({
            "success": false,
            "message": "authentication failed"
        })
    } else {
        if (user.role == "admin") {
            userController.deleteUserByID(res, req.params.id);
        } else {
            res.status(403).json({
                "success": false,
                "message": "Authorization failed"
            })
        }
    }
});

//BLOCK OR UNBLOCK USER BY ID (auth : ADMIN)
userRouter.put("/:id", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res);
    console.log(user);

    if (!user) {
        res.status(401).json({
            "success": false,
            "message": "authentication failed"
        })
    } else {
        if (user.role == "admin") {
            userController.activeOrBlockUserAccountByID(res, req.params.id);
        } else {
            res.status(403).json({
                "success": false,
                "message": "Authorization failed"
            })
        }
    }
});

//CHANGE USER PASSWORD
userRouter.put("/u1/pass", async (req, res) => {
    const user = await middlewareController.verifyToken(req, res);

    if (user) {
        console.log("get in controller");
        userController.ChangeUserPassword(req, res, user.id);
    } else {
        res.status(401).json({
            "success": false,
            "message": "authentication fail"
        })
    }
});


//LOGIN USER
userRouter.post("/login", userController.loginUser);
module.exports = userRouter;