const userRouter = require("express").Router();
const middlewareController = require("../../controllers/middlewareController");

const { UserAccount } = require("../../model/userModel");
const { Permission } = require("../../model/userModel");
const userController = require("../../controllers/userController");


const endpoint = '/users'

//Get All USER (auth: ADMIN)
userRouter.get("/", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : user.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        userController.getAllUser(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});



//UPDATE USER(auth: ADMIN)
userRouter.put("/:id", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : user.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
       userController.UpdateUserByID(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//DELETE USER (auth: ADMIN)
userRouter.delete("/:id", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : user.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        userController.deleteUserByID(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


module.exports= userRouter;

