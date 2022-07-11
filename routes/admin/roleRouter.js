const roleRouter = require("express").Router();
const middlewareController = require("../../controllers/middlewareController");
const { UserAccount } = require("../../model/userModel");
const { Permission } = require("../../model/userModel");
const roleController = require ( "../../controllers/roleController");



const endpoint = '/roles'

//Get All ROLE (auth: ADMIN)
roleRouter.get("/", async (req, res) => {

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
        roleController.getAllRole(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//ADD ROLE (auth: ADMIN)
roleRouter.post("/", async (req, res) => {

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
        roleController.addRole(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//UPDATE ROLE(auth: ADMIN)
roleRouter.put("/:id", async (req, res) => {

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
        roleController.UpdateRoleByID(req,res.req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//DELETE ROLE (auth: ADMIN)
roleRouter.delete("/:id", async (req, res) => {

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
        roleController.deleteRoleByID(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


module.exports= roleRouter;

