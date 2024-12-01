const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
require('dotenv').config();





// Mailgun Client Configuration
const mg = mailgun.client({
  username: 'api',
  key: process.env.mailgun_api // use your own Mailgun API key
});

// Generate a 4-digit random code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
};

// Function to send email with Mailgun
const sendEmail = async (recipientEmail) => {
  const code = generateVerificationCode(); // Generate 4-digit code

    // HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Swastik Verification Code</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #4a148c; padding-bottom: 20px; text-align: center; }
        .content { padding: 20px 0; }
        .code { background-color: #f4f4f4; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; }
        .footer { border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #4a148c;">Swastik</h1>
        </div>
        <div class="content">
          <h2>Your one-time login code is</h2>
          <div class="code">${code}</div>
          <p>If you have not initiated the login, please reset your credentials.</p>
        </div>
        <div class="footer">
          <p>This email was sent to you by Swastik because you signed up for a Swastik account. Please let us know if you feel that this email was sent to you by error.</p>
          <p>© 2024 Swastik | 155 ek onkar, Kharar, Chandigarh,  India</p>

          <p>
            <a href="#" style="color: #4a148c; text-decoration: none;">Privacy Policy</a> |
            <a href="#" style="color: #4a148c; text-decoration: none;">Terms of Service</a> |
            <a href="#" style="color: #4a148c; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Email data
  const emailData = {
    from: "verification@swastik.com",
    to: recipientEmail,
    subject: "Your Swastik Verification Code",
    html: htmlTemplate
  };

  // Send the email
  try {
    const result = await mg.messages.create('onlinesbii.live', emailData);
    console.log('Email sent:', result);
    return code; // Return the verification code as response
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
