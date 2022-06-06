const mongoose = require("mongoose");

let CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model("category", CategorySchema);