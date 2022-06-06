const mongoose = require("mongoose");

let InvoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  staff: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "staff"
  },
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "customer"
  },
  total: {
    type: Number,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product"
      },
      name: String,
      price: String,
      qty: {
        type: Number,
        default: 1
      }
    }
  ]
});

module.exports = mongoose.model("invoice", InvoiceSchema);