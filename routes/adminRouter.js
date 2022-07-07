const adminRouter = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const { getAllUser } = require("../controllers/userController");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController")
const userValidate = require("../controllers/validation/userValidateRegister");
const logger = require("../controllers/logger/winstonLogger");
const { UserAccount } = require("../model/userModel");
const { AuthAccount, Userrole, Permission } = require("../model/userModel");
const { model } = require("mongoose");


const endpoint = '/admin'

//Get All User (auth: ADMIN)
adminRouter.get("/users", async (req, res) => {

    

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        logger.info({
            "success": false,
            "message": "did not found any user"
        });
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : user.role, endpoint : endpoint, method : req.method })

    console.log(permission)
    if (permission) {
        adminController.getAllUser(req, res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


module.exports= adminRouter;

