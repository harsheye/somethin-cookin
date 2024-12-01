const sendEmail = require('../controllers/component/sendEmail');

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const code = await sendEmail(email);
    res.json({ message: 'Verification code sent', code });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
