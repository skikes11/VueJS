const mongoose = require("mongoose");
const { Product } = require("../model/productModel")
const {UserAccount} = require("../model/userModel")



const  OrderSchema= new mongoose.Schema({
        User_ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAccount',
            default: null
        },
        status: {
            type : Number,
            default : 0
        },
        totalPrice: {
            type : Number,
            default : 0
        },
        createAt : {
            type : Date,
            default: Date.now()
        }
        
});

const  OrderItemsSchema= new mongoose.Schema({
    Order_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        require: true
    },
    Product_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true
    },
    quantity: {
        type : Number,
        require:true
    },
    createAt : {
        type : Date,
        default: Date.now()
    }
});





let Order = mongoose.model("Order", OrderSchema);

let OrderItems = mongoose.model("OrderItems", OrderItemsSchema);
module.exports = {Order, OrderItems };