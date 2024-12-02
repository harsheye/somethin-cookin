const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

// Mailgun Client Configuration
const mg = mailgun.client({
  username: 'api',
  key: process.env.mailgun_api
});

// Store OTPs temporarily (use Redis in production)
const otpStore = new Map();

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(email, {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000
    });

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
          <h2>Your verification code is:</h2>
          <div class="code">${verificationCode}</div>
          <p>This code will expire in 10 minutes.</p>
        </div>
        <div class="footer">
          <p>This email was sent to you by Swastik. If you didn't request this code, please ignore this email.</p>
          <p>© 2024 Swastik | 155 ek onkar, Kharar, Chandigarh, India</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email using Mailgun
    const emailData = {
      from: "Swastik Verification <verification@cuchd.live>",
      to: email,
      subject: "Your Swastik Verification Code",
      html: htmlTemplate
    };

    await mg.messages.create('cuchd.live', emailData);
    
    // Return success without exposing the OTP in production
    res.json({ 
      success: true,
      message: 'Verification code sent successfully',
      code: process.env.NODE_ENV === 'development' ? verificationCode : undefined 
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send verification email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'No verification code found' });
    }
    
    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'Verification code expired' });
    }
    
    if (storedData.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Code is valid - clean up
    otpStore.delete(email);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
}; 