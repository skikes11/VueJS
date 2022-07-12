const { Product } = require("../model/productModel");

const productController = {

    addProduct: async (req, res) => {
        try {
            const product = await new Product({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                total_quantity: req.body.total_quantity,
                brand: req.body.brand,
                origin: req.body.origin,
                description: req.body.description
            });
            await product.save().then(
                console.log("save product successfully")
            );
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllProduct: async (req, res) => {
        try {
            const product = await Product.find();
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },

    GetAllProductsExits: async (req, res ) => {
        try {

            const products = await Product.find({ total_quantity :  {$gt: 0} })                 

            if(products){
                res.status(200).json(products)
            }else{
                res.status(401).json({
                    "message" : "no product found"
                })
            }

                                                                                                 
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": err.message
            });
            
        }
    },
    updateProduct: async (req, res, id) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
            product.name = req.body.name
            product.price = req.body.price
            product.image = req.body.image
            product.brand = req.body.brand
            product.total_quantity = req.body.total_quantity
            product.origin = req.body.origin
            product.description = req.body.description
            await product.save().then(
                console.log("update product successfully")
            );
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    deleteProduct: async (req, res, id) => {
        try {
            if (await Product.findByIdAndDelete(id)) {
                res.status(200).json("DELETE PRODUCT SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
        } catch (err) {
            res.status(400).json(err.message);

        }
    },

}

module.exports = productController;