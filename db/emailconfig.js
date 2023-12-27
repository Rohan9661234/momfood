const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
        user: "momfood629@gmail.com", // generated ethereal user
        pass: "dqdelxuhrocoldiq", // generated ethereal password
    }
})


module.exports =  transporter ;