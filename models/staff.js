const mongoose = require("mongoose");

let StaffSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false
  },
  staffid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    surname: {type: String, required: true},
    othername: {type: String, required: true},
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
});

module.exports = mongoose.model("staff", StaffSchema);