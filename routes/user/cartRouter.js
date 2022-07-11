const cartRouter = require("express").Router();

const orderController = require("../../controllers/orderController");
const userActionController = require("../../controllers/userActionController");

const UserActionController = require("../../controllers/userActionController");
const { OrderItems } = require("../../model/orderModel");

// GET ALL PRODUCT IN USER CART
cartRouter.get("/", async (req, res) => {
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

        orderController.getAllOrderByUserID(req,res,userToken.id);
    
});

//DELETE ORDER ITEM IN CART
cartRouter.get("/delete/:id", async (req, res) => {
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

    const order = await  Order.findOne({ User_ID : userToken.id, status : 0 }) // get order to check

    const orderItem = await OrderItems.findOne({ Order_ID : order._id })

    if(orderItem){   // security check 
        if(orderItem._id == req.params.id ){
            userActionController.DeleteProductInCart(req,res,req.params.id);
        }else{
            res.status(403).json({
                "message" : "authentication fail"
             })
        }
    }else{
         res.status(403).json({
            "message" : "authentication fail"
         })
    }

});


module.exports = cartRouter;

