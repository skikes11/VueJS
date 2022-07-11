const productRouter = require("express").Router();
const middlewareController = require("../../controllers/middlewareController");

const { UserAccount } = require("../../model/userModel");
const {  Permission } = require("../../model/userModel");
const productController = require ( "../../controllers/productController")


const endpoint = '/products'

//Get All Product (auth: ADMIN)
productRouter.get("/", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : userToken.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        productController.getAllProduct(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//ADD Product (auth: ADMIN)
productRouter.post("/", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : userToken.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        productController.addProduct(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//UPDATE Product (auth: ADMIN)
productRouter.put("/:id", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : userToken.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        productController.updateProduct(req,res.req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//DELETE Product (auth: ADMIN)
productRouter.delete("/:id", async (req, res) => {

    const userToken = await middlewareController.verifyToken(req, res)
    console.log(userToken)
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    const user = await UserAccount.findById(userToken.id);

    const permission = await Permission.findOne({ role : userToken.role, endpoint : endpoint, method : req.method });

    console.log(permission)
    if (permission) {
        productController.deleteProduct(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});



module.exports= productRouter;

