require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        const { firstname, email, subject } = JSON.parse(event.body);

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

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
