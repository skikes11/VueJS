
const { Order } = require("../model/orderModel");
const helperFunc = require("./helperFunc");


const orderController = {

    getAllOrder_User: async (req, res, id) => {
        try {
            try {
                const order = await Order.findOne({ User_ID : id, status : [1,2] }).populate('User_ID');
                res.status(200).json(order);
            } catch (err) {
                res.status(400).json(err.message);

            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    getAllOrder: async (req, res) => {
        try {
            try {
                const order = await Order.find().populate('User_ID');
                helperFunc.status(res,true,order,null)
            } catch (err) {
                res.status(400).json(err.message);
            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    addOrder: async (req, res, idUser) => {
        try {
            const order = await new Order({
                User_ID: req.body.User_ID,
                status: req.body.status,
                created: req.body.created
            })
            await order.save();
            res.status(200).json(order);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    UpdateOrder: async (req, res, id, idUser) => {
        try {

            const order = await Order.findById(id)

            if (!order) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found order"
                });
            }

            order.User_ID = req.body.User_ID
            order.status = req.body.status
            order.created = req.body.created
            order.totalPrice = req.body.totalPrice
            await order.save()
            res.status(200).json(order);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    deleteOrder: async (req, res, id, idUser) => {
        try {
            if (await Order.findByIdAndDelete(id)) {
                res.status(200).json("DELETE ORDER SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found order"
                });
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
}

module.exports = orderController;