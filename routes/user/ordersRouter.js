const orderRouter = require("express").Router();

const orderController = require("../../controllers/orderController");
const userActionController = require("../../controllers/userActionController");



// GET ALL ORDER BY USER TOKEN
orderRouter.get("/", async (req, res) => {
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

        orderController.getAllOrder_User(req,res,userToken.id);
    
});

// PAYMENT ORDER 
orderRouter.get("/payment", async (req, res) => {
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

        userActionController.PaymentOrder(req,res,userToken.id);
    
});



module.exports = orderRouter;



