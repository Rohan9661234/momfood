const mongoose = require("mongoose");

const TiffinSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  tiffin: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  fromdate: {
    type: Date,
    required: true,
  },
  todate: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  SubmitDate: {
    type: Date,
    default: Date.now,
  },
  totalcost: {
    type: Number,
    required: true,
  },
  response: {
    type: String,
    default: null,
  },
});

const TiffinForm = new mongoose.model("TiffinForm", TiffinSchema);

module.exports = TiffinForm;
