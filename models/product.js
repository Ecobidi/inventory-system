const mongoose = require("mongoose");

let ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    // required: true
  },
  // image: String,
  image_public_id: String,
  qty: Number,
});

module.exports = mongoose.model("product", ProductSchema);