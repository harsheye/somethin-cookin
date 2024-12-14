const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
  const { username, password, email, mobileNo, name, pincode } = req.body;

  if (!username || !password || !email || !mobileNo || !name || !pincode) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({
      $or: [
        { 'basicDetails.authentication.username': username },
        { 'basicDetails.authentication.email': email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this username or email' 
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      basicDetails: {
        authentication: {
          username,
          password: hashedPassword,
          email,
          isVerified: true
        },
        profile: {
          name,
          mobileNo,
          pincode
        },
        userRole: 'customer'
      }
    });

    await newUser.save();

    const token = jwt.sign(
      { 
        userId: newUser._id, 
        userRole: newUser.basicDetails.userRole 
      }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.basicDetails.authentication.username,
        email: newUser.basicDetails.authentication.email,
        name: newUser.basicDetails.profile.name,
        userRole: newUser.basicDetails.userRole
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  try {
    const user = await User.findOne({ 
      'basicDetails.authentication.username': username 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(
      password, 
      user.basicDetails.authentication.password
    );

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
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.basicDetails.authentication.username,
        email: user.basicDetails.authentication.email,
        name: user.basicDetails.profile.name,
        userRole: user.basicDetails.userRole
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};
