const orderRouter = require("express").Router();
const middlewareController = require("../../controllers/middlewareController");

const { UserAccount } = require("../../model/userModel");
const {  Permission } = require("../../model/userModel");
const orderController = require ( "../../controllers/orderController")


const endpoint = '/orders'

//Get All ORDER (auth: ADMIN)
orderRouter.get("/", async (req, res) => {

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
       orderController.getAllOrder(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//ADD ORDER (auth: ADMIN)
orderRouter.post("/", async (req, res) => {

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
        orderController.addOrder(req,res);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});

//UPDATE ORDER (auth: ADMIN)
orderRouter.put("/:id", async (req, res) => {

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
        orderController.UpdateOrder(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


//DELETE Product (auth: ADMIN)
orderRouter.delete("/:id", async (req, res) => {

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
        orderController.deleteOrder(req,res,req.params.id);
    } else {
        res.status(403).json({
            "success": false,
            "message": "permission deny"
        })
    }
});


module.exports= orderRouter;

