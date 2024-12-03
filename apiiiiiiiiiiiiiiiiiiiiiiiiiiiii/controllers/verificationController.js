const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email, type = 'customer' } = req.body;
    console.log('Generating OTP for:', { email, type });
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('Development OTP:', otp); // For development

    // Store OTP
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 120000
    });

    // Set cleanup timeout
    setTimeout(() => {
      if (otpStore.has(email)) {
        otpStore.delete(email);
      }
    }, 120000);

    // Return OTP in development
    res.json({ 
      success: true,
      message: 'Verification code generated',
      code: otp // We'll show this for now
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate verification code'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired or not found' 
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired' 
      });
    }

    // Clear OTP after successful verification
    otpStore.delete(email);

    res.json({ 
      success: true,
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify email'
    });
  }
}; 