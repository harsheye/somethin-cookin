const Order = require('../models/Order');
const Farmer = require('../models/Farmer'); // Assuming you have a Farmer model
const User = require('../models/User');
// Middleware to check if the farmer owns the order
const isFarmerAuthorized = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('products.product', 'farmer');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Check if the user is the farmer for any of the products in the order
  const isFarmer = order.products.some(product => {
    return product.product.farmer.toString() === req.user.userId.toString();
  });

  if (!isFarmer) {
    return res.status(403).json({ message: 'Unauthorized to change this order status' });
  }

  next();
};

// API to mark order as packed
// Mark order as packed using custom orderId
exports.markOrderAsPacked = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find and update the order using the custom orderId
      const order = await Order.findOneAndUpdate(
        { orderId },
        { status: 'Packed' },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order marked as packed' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking order as packed', error: error.message });
    }
  };
  
  

// Mark order as shipped using custom orderId
exports.markOrderAsShipped = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by the custom orderId
      const order = await Order.findOne({ orderId });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order is packed before shipping
      if (order.status !== 'Packed') {
        return res.status(400).json({ message: 'Order must be packed before shipping' });
      }
  
      // Update the order status to shipped
      order.status = 'shipped';
      await order.save();
  
      res.status(200).json({ message: 'Order marked as shipped' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking order as shipped', error: error.message });
    }
  };
  
  
  

exports.markOrderAsDelivered = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by the custom orderId
      const order = await Order.findOne({ orderId }); // Use populate if user is a reference
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Check if the order is shipped before marking as delivered
      if (order.status !== 'shipped') {
        return res.status(400).json({ message: 'Order must be shipped before it can be delivered' });
      }
  
      // Check if user exists
      if (!order.user) {
        return res.status(404).json({ message: 'User not associated with this order' });
      }
  
      // Update the order status to delivered
      order.status = 'delivered';
      await order.save();
  
      // Find the user associated with the order
      const user = await User.findById(order.user); // Make sure to fetch the user by ID
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Prepare the products to be added to the user's review list
      const productsToAdd = order.products.map(item => ({
        product: item.product,
        isReviewed: false,
      }));
  
      // Check if productsToBeReviewed array exists and initialize it if it doesn't
      if (!user.productsToBeReviewed) {
        user.productsToBeReviewed = [];
      }
  
      // Add delivered order products to user's productsToBeReviewed array
      user.productsToBeReviewed.push(...productsToAdd);
      await user.save();
  
      res.status(200).json({ message: 'Order marked as delivered and products added for review' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking order as delivered', error: error.message });
    }
  };
  