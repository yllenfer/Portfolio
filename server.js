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
        // Extract data from the request body
        const { firstname, email, subject } = req.body;

        // Create a transporter for sending emails
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Define email options
        let mailOptions = {
            from: 'your-gmail@gmail.com',
            to: 'yllenfernandez@gmail.com',
            subject: `New Contact Form Submission from ${firstname}`,
            text: `You have a new submission from:\nName: ${firstname}\nEmail: ${email}\nMessage: ${subject}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                // Respond with an error if sending email fails
                return res.status(500).send("Error while sending email.");
            }

            console.log('Message sent: %s', info.messageId);
            // Respond with a success message if the email is sent successfully
            res.status(200).send('Email sent successfully!');
        });
    } catch (error) {
        // Handle unexpected errors and respond with an internal server error
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;

// Define a catch-all route for any other type of request (e.g., GET)
app.all('*', (req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
