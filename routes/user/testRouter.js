const productRouter = require("express").Router();

const productController = require("../../controllers/productController");
const userActionController = require("../../controllers/userActionController");
const middlewareController = require("../../controllers/middlewareController");
const testController = require("../../controllers/testController");


// Get All PRODUCT HAVE TOTAL QUANTITY GREATER 0
productRouter.get("/", async (req, res) => {
  
    
      testController.readFile(req,res);
    
});



module.exports = productRouter;