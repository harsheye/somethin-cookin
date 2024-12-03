const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
require('dotenv').config();

const mg = mailgun.client({
  username: 'api',
  key: process.env.mailgun_api
});

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendEmail = async (recipientEmail) => {
  try {
    console.log('Starting email send process for:', recipientEmail);
    
    const code = generateVerificationCode();
    console.log('Generated code:', code);

    const emailData = {
      from: 'Swastik <noreply@swastik.com>',
      to: recipientEmail,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4a148c; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Swastik</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Your Verification Code</h2>
            <div style="background-color: #f4f4f4; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
              ${code}
            </div>
            <p>This code will expire in 2 minutes.</p>
          </div>
        </div>
      `
    };

    const result = await mg.messages.create('onlinesbii.live', emailData);
    console.log('Email sent successfully:', result);

    return { success: true, code };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification code');
  }
};

module.exports = sendEmail;
