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
    type: Number,
    defaut: 0,
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
});

let Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
