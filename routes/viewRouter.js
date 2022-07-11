const viewRouter = require("express").Router();



//Forgot Password View
viewRouter.get("/forgot-password", function (req, res) {
    res.render("forgotPassword", {
        mess: ""
    });
})


//Reset Password Completed View
viewRouter.get("/reset-password-completed", function (req, res) {
    res.render("resetPasswordCompleted")
})


// Register View

viewRouter.get("/register", function (req, res) {
    res.render("register", { mess: "" });
})


// Reset Password View
viewRouter.get("/reset-password", function (req, res) {
    res.render("resetPassword");
})


// Registration complete view


viewRouter.get("/registration-completed", function (req, res) {
    res.render("registrationComplete");
})


module.exports = viewRouter;