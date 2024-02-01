// netlify/functions/contact-form.js
exports.handler = async function (event, context) {
    try {
      // Your form submission logic here
      // Send an email, store in a database, etc.
      return {
        statusCode: 200,
        body: 'Form submitted successfully!',
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  };
  