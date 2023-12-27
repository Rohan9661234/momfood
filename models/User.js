const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        default: 'customer',
        type: String,
        required: true
    },
    location: { 
        default: null,
        type: String
    }
})

const User = new mongoose.model("User", UserSchema);

module.exports = User;