const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  total_quantity: {
    type: String,
  },

  brand: {
    type: String,
  },
  origin: {
    type: String,
  },
  description: {
    type: String,
  },
  createAt : {
    type : Date,
    default: Date.now()
  }
});

let Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
