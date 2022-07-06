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
        created :{
            type: String,
        },
        
});

const  OrderItemsSchema= new mongoose.Schema({
    Order_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    Product_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    quantity: {
        type : Number,
        require:true
    },
});





let Order = mongoose.model("Order", OrderSchema);

let OrderItems = mongoose.model("OrderItems", OrderItemsSchema);
module.exports = {Order, OrderItems };