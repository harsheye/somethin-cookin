// controllers/userController.js
const User = require('../models/User');
const Farmer = require('../models/Farmer'); // Import the Farmer model

// Helper function to customize the response
const customizeUserResponse = (user) => {
  return {
    basicDetails: {
      email: user.basicDetails.authentication.email,
      profile: user.basicDetails.profile,
      userRole: user.basicDetails.userRole,
    },
    addresses: user.addresses,
    // Handle orders for users
    orders: user.orders ? user.orders.map(order => ({
      orderId: order.orderId,
      status: order.status,
      totalPrice: order.totalPrice,
      totalProducts: order.products.length,
      timestamp: order.timestamp,
    })) : [],
    // Handle orders received for farmers
    ordersReceived: user.ordersReceived ? Array.from(user.ordersReceived.values()).map(order => ({
      order: order.order,
      products: order.products,
      totalEarnings: order.totalEarnings,
      timestamp: order.timestamp,
    })) : [],
  };
};

exports.getUserDetailsAdmin = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is coming from the route params

    // First, check the User collection
    let user = await User.findById(userId);
    // If not found, check the Farmer collection
    if (!user) {
      user = await Farmer.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customizedResponse = customizeUserResponse(user);

    res.json(customizedResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId comes from the authenticated user token

    // First, check the User collection
    let user = await User.findById(userId);
    // If not found, check the Farmer collection
    if (!user) {
      user = await Farmer.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customizedResponse = customizeUserResponse(user);

    res.json(customizedResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;
    const allowedUpdates = ['name', 'mobileNo', 'pincode', 'selfieUrl'];
    
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.keys(updates).forEach(update => {
      if (update === 'selfieUrl') {
        user.basicDetails.profile.selfie = updates[update];
      } else {
        user.basicDetails.profile[update] = updates[update];
      }
    });

    await user.save();

    res.json({ message: 'Profile updated successfully', user: user.basicDetails.profile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
