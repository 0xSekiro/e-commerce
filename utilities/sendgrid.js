const sendgrid = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.EMAIL_API_KEY;

sendgrid.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (userEmail, subject, text) => {
  const msg = {
    to: `${userEmail}`,

    // Change to your recipient

    from: process.env.EMAIL_SENDER,

    // Change to your verified sender

    subject: `${subject}`,

    text: `${text}`,
  };
  await sendgrid.send(msg);
};

module.exports = sendEmail;
