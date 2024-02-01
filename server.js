require('dotenv').config();
require('dotenv').config();


const express = require('express');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.post('/send-email', async (req, res) => {
    const { firstname, email, subject } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD 
        }
    });

    
    let mailOptions = {
        from: 'your-gmail@gmail.com', 
        to: 'yllenfernandez@gmail.com', 
        subject: `New Contact Form Submission from ${firstname}`, 
        text: `You have a new submission from: Name: ${firstname}, Email: ${email}, Message: ${subject}`, // plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error while sending email.");
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).send("Email successfully sent!");
    });
    
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
