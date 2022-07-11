const permissionRouter = require("express").Router();
const middlewareController = require("../../controllers/middlewareController");
const { UserAccount } = require("../../model/userModel");
const { Permission } = require("../../model/userModel");
const permissionController = require ( "../../controllers/permissionController");



const endpoint = '/permissions'

//Get All PERMISSION (auth: ADMIN)
permissionRouter.get("/", async (req, res) => {

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
        permissionController.getAllPermission(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//ADD PERMISSION (auth: ADMIN)
permissionRouter.post("/", async (req, res) => {

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
        permissionController.addPermission(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//UPDATE PERMISSION(auth: ADMIN)
permissionRouter.put("/:id", async (req, res) => {

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
        permissionController.UpdatePermissionByID(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//DELETE PERMISSION (auth: ADMIN)
permissionRouter.delete("/:id", async (req, res) => {

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
        permissionController.deletePermissionByID(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


module.exports= permissionRouter;

