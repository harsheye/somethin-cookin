const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company'); // Ensure this path is correct
const JWT_SECRET = process.env.JWT_SECRET;
const Trade = require('../models/Trade');
const Order = require('../models/Order');

// Register Company
exports.registerCompany = async (req, res) => {
  const { companyName, email, address, phoneNumber, deliveryAddress, password } = req.body;

  if (!companyName || !email || !address || !phoneNumber || !deliveryAddress || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the company email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new company instance with hashed password
    const company = new Company({
      companyName,
      email,
      address,
      phoneNumber,
      deliveryAddress,
      password: hashedPassword,
    });

    // Save the company to the database
    await company.save();

    res.status(201).json({ message: 'Company registered successfully', company });
  } catch (error) {
    console.error('Error registering company:', error);
    res.status(500).json({ message: 'Error registering company', error: error.message });
  }
};

// Company Login
exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with stored hash
    const isMatch = await bcryptjs.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { companyId: company._id, companyName: company.companyName },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Error logging in company:', error);
    res.status(500).json({ message: 'Error logging in company', error: error.message });
  }
};

// Get Orders Placed by Company
exports.getOrders = async (req, res) => {
  const { companyId } = req.user; // Extract companyId from JWT token

  try {
    // Fetch all orders placed by the company
    const orders = await Order.find({ 'bulkOrders.companyId': companyId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this company' });
    }

    // Return the orders
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Error getting orders', error: error.message });
  }
};

// Get Trades (Won or Accepted by Company)
exports.getTrades = async (req, res) => {
  const { companyId } = req.user; // Extract companyId from JWT token

  try {
    // Find the company and populate their trades
    const company = await Company.findById(companyId)
      .populate('tradesWon.companyId')
      .populate('tradeHistory.companyId');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Return the trades
    res.status(200).json({
      message: 'Trades retrieved successfully',
      tradesWon: company.tradesWon,
      tradeHistory: company.tradeHistory
    });
  } catch (error) {
    console.error('Error getting trades:', error);
    res.status(500).json({ message: 'Error getting trades', error: error.message });
  }
};
