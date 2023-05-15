const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  contact: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  otp: {
    type: Number,
  },
  cash_bonus: {
    type: Number,
    default: 50,
  },
  verify_otp: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: "",
  },
});

const model = mongoose.model("users", schema);

module.exports = model;
