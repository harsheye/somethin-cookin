const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authController = require('../controllers/authController');

const router = express.Router();
const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

router.post('/register', async (req, res) => {
  const { username, password, email, mobileNo, name, pincode } = req.body;

  if (!username || !password || !email || !mobileNo || !name || !pincode) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      profile: { mobileNo, name, pincode }
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        userRole: user.basicDetails.userRole 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    const userData = user.toObject();
    delete userData.password;
    
    res.json({ 
      token,
      userRole: user.basicDetails.userRole,
      user: userData
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

router.post('/send-verification', authController.sendVerificationEmail);

module.exports = router;