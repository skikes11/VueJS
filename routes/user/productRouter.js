const productRouter = require("express").Router();

const productController = require("../../controllers/productController");
const userActionController = require("../../controllers/userActionController");
const middlewareController = require("../../controllers/middlewareController");



// Get All PRODUCT HAVE TOTAL QUANTITY GREATER 0
productRouter.get("/", async (req, res) => {
    const userToken = await middlewareController.verifyToken(req, res)
    
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }

    
      productController.GetAllProductsExits(req,res);
    
});

// USER CLICK BUY PRODUCT <=> ADD PRODUCT TO CART 
productRouter.get("/buy/:id", async (req, res) => {
    const userToken = await middlewareController.verifyToken(req, res)
    
    if (!userToken) {
        return res.status(401).json({
            "success": false,
            "message": "authentication fail"
        });
    }
 
      userActionController.clickBuyProduct(req,res,userToken.id, req.params.id);
    
});

module.exports = productRouter;