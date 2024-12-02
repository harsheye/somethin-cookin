const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const { deleteFiles } = require('./fileuploadController');
const mongoose = require('mongoose');

// Existing register and login functions...

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;
  const userRole = req.user.role;
  const collectionName = req.user.collection;

  try {
    let user;
    if (collectionName === 'farmers') {
      user = await Farmer.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.basicDetails.authentication.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.basicDetails.authentication.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing the password' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ 'basicDetails.authentication.username': username });
    let collectionName = 'users';

    if (!user) {
      user = await Farmer.findOne({ 'basicDetails.authentication.username': username });
      collectionName = 'farmers';
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP (you can use a library like `otp-generator` for this)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP to user document (you might want to add an OTP field to your schema)
    user.passwordResetOTP = otp;
    user.passwordResetOTPExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send OTP via email or SMS
    console.log(`OTP for ${username}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in forgot password process:', error);
    res.status(500).json({ error: 'An error occurred during the forgot password process' });
  }
};

exports.updatePersonalInfo = async (req, res) => {
  const userId = req.user.userId;
  const { name, mobileNo, pincode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.basicDetails.profile.name = name;
    if (mobileNo) user.basicDetails.profile.mobileNo = mobileNo;
    if (pincode) user.basicDetails.profile.pincode = pincode;

    await user.save();
    res.json({ message: 'Personal information updated successfully' });
  } catch (error) {
    console.error('Error updating personal information:', error);
    res.status(500).json({ error: 'An error occurred while updating personal information' });
  }
};

exports.updatePrimaryAddress = async (req, res) => {
  const userId = req.user.userId;
  const { street, city, state, country, zipCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.basicDetails.address = { street, city, state, country, zipCode };
    await user.save();

    res.json({ message: 'Primary address updated successfully', address: user.basicDetails.address });
  } catch (error) {
    console.error('Error updating primary address:', error);
    res.status(500).json({ error: 'An error occurred while updating the primary address' });
  }
};

exports.addAdditionalAddress = async (req, res) => {
  const userId = req.user.userId;
  const { street, city, state, country, zipCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = { street, city, state, country, zipCode };
    user.addresses.push(newAddress);
    await user.save();

    res.json({ message: 'Additional address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error adding additional address:', error);
    res.status(500).json({ error: 'An error occurred while adding the additional address' });
  }
};

exports.updateAdditionalAddress = async (req, res) => {
  const userId = req.user.userId;
  const addressId = req.params.addressId;
  const updateData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    Object.assign(address, updateData);
    await user.save();

    res.json({ message: 'Additional address updated successfully', address });
  } catch (error) {
    console.error('Error updating additional address:', error);
    res.status(500).json({ error: 'An error occurred while updating the additional address' });
  }
};

exports.deleteAdditionalAddress = async (req, res) => {
  const userId = req.user.userId;
  const addressId = req.params.addressId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({ message: 'Additional address deleted successfully' });
  } catch (error) {
    console.error('Error deleting additional address:', error);
    res.status(500).json({ error: 'An error occurred while deleting the additional address' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email, mobileNo, name, pincode, userRole, address } = req.body;
    
    // Validate required fields
    if (!username || !password || !email || !mobileNo || !name || !pincode || !userRole || !address) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [
        { 'basicDetails.authentication.username': username },
        { 'basicDetails.authentication.email': email },
        { 'basicDetails.profile.mobileNo': mobileNo }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      basicDetails: {
        authentication: { username, password: hashedPassword, email },
        profile: { mobileNo, name, pincode },
        userRole
      },
      address
    };
    
    let newUser;
    if (userRole === 'farmer') {
      newUser = new Farmer({
        ...userData,
        products: [],
        ordersReceived: [],
        trades: []
      });
    } else {
      newUser = new User(userData);
    }
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userRole });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }

    let user = await User.findOne({ 'basicDetails.authentication.username': username });
    let collectionName = 'users';
    
    if (!user) {
      user = await Farmer.findOne({ 'basicDetails.authentication.username': username });
      collectionName = 'farmers';
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.basicDetails.authentication.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.basicDetails.userRole, collection: collectionName },
      JWT_SECRET,
      { expiresIn: '12h' }
    );
    
    res.json({ token, userRole: user.basicDetails.userRole, collection: collectionName });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
