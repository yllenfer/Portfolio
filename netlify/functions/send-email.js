require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/send-email', async (req, res) => {
    try {
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
            text: `You have a new submission from:\nName: ${firstname}\nEmail: ${email}\nMessage: ${subject}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Error while sending email.");
            }

            console.log('Message sent: %s', info.messageId);
            res.status(200).send('Email sent successfully!');
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;
