
const { Order, OrderItems } = require("../model/orderModel");
const helperFunc = require("./helperFunc");


const orderItemsController = { 
    
    getOrderItems_ByOrderID: async (req, res, id) => {
        try {
            try {
                const orderItems = await OrderItems.findOne({ Order_ID: id }).populate('Product_ID');
                res.status(200).json(orderItems);
            } catch (err) {
                res.status(400).json(err.message);

            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    getAllOrderItems: async (req, res) => {
        try {
            try {
                const orderItems = await OrderItems.find().populate('Product_ID');
                helperFunc.status(res,true,orderItems,null)
            } catch (err) {
                res.status(400).json(err.message);
            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    addOrderItems: async (req, res, idUser) => {
        try {
            const orderItem = await new OrderItems({
                Order_ID: req.body.Order_ID,
                Product_ID: req.body.Product_ID,
                quantity: req.body.quantity
            })
            await orderItem.save();
            res.status(200).json(orderItem);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    UpdateOrderItemsByID: async (req, res, id, idUser) => {
        try {

            const orderItem = await OrderItems.findById(id)

            if (!orderItem) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found order Item"
                });
            }

            orderItem.Order_ID = req.body.Order_ID
            orderItem.Product_ID = req.body.Product_ID
            orderItem.quantity = req.body.quantity

            await orderItem.save()
            res.status(200).json(orderItem);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    DeleteOrderItemsByID: async(req,res,id, idUser) => {
        if(await OrderItems.findByIdAndDelete(id)){
            res.status(200).json({
                "message" : "DELETE ORDER ITEM SUCCESS"
            })
        }
    }
}

module.exports = orderItemsController;