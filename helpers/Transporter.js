const nodemailer = require ("nodemailer")

// Test Email
const transporter = nodemailer.createTransport ({
    service: "gmail",
    auth: {
        user: "fandi.ario10@gmail.com",
        pass: "dhxopgqdonbfaoek"
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter