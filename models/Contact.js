const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    number: {
        type: Number,
        unique: true,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Contact = new mongoose.model("Contact", ContactSchema);

module.exports = Contact;