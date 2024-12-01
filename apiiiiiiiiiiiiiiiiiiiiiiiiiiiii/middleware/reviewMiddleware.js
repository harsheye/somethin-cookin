const Order = require('../models/Order');

// Middleware to check if user has ordered the product
exports.hasOrderedProduct = async (req, res, next) => {
 
    try {
      const userId = req.user.userId;
      const productId = req.body.productId || req.params.productId || req.query.productId; // Allow flexibility in receiving productId
      console.log("User ID:", userId); // Debug log for userId
      console.log("Product ID:", productId); // Debug log for productId
  
      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }
  
      // Check if the user has an order with the specified product
      const hasOrdered = await Order.exists({ user: userId, 'items.product': productId });
      console.log("Has Ordered:", hasOrdered); // Debug log to check if the order exists
  
      if (!hasOrdered) {
        return res.status(403).json({ message: 'You can only review products you have ordered' });
      }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking order history', error: error.message });
  }
};