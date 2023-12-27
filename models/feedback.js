const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }

})

const Schema = new mongoose.model("Feedback", FeedbackSchema);

module.exports = Schema;