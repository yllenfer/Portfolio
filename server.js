require('dotenv').config();
require('dotenv').config();
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASSWORD);

const express = require('express');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.post('/send-email', async (req, res) => {
    const { firstname, email, subject } = req.body;

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD // Your Gmail password or App Password
        }
    });

    // Setup email data
    let mailOptions = {
        from: 'your-gmail@gmail.com', // sender address
        to: 'yllenfernandez@gmail.com', // list of receivers
        subject: `New Contact Form Submission from ${firstname}`, // Subject line
        text: `You have a new submission from: Name: ${firstname}, Email: ${email}, Message: ${subject}`, // plain text body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.status(500).send("Error while sending email.");
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).send("Email successfully sent!");
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
