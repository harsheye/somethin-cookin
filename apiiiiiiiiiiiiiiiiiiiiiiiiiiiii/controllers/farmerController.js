const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const Order = require('../models/Order');
const axios = require('axios');

exports.addProduct = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const farmerId = req.user.userId; // Get farmer ID from JWT
    console.log('Farmer ID from token:', farmerId);

    const { name, description, price, unit, smallestSellingUnit, category, isForSale } = req.body;

    // Create and save the new product
    const product = new Product({
      farmer: farmerId,
      name,
      description,
      price,
      unit,
      smallestSellingUnit,
      category,
      isForSale
    });

    await product.save();

    // Update the farmer's products field with the new product ID
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Push the new product ID to the farmer's products array
    farmer.products.push(product._id); // Directly push the ObjectId

    await farmer.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




exports.getReceivedOrders = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const farmerId = req.user.userId;
    console.log('Farmer ID from token:', farmerId);

    // Find farmer by ID
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Extract order IDs from the ordersReceived Map
    const orderIds = Array.from(farmer.ordersReceived.values()).map(order => order.order);

    // Find the orders and populate the necessary fields
    const orders = await Order.find({
      _id: { $in: orderIds }
    })
    .populate('user', 'basicDetails.profile.name')  // Populate user's name
    .populate('products.product', 'name price');    // Populate product's name and price

    // Send the orders as response
    res.json(orders);
  } catch (error) {
    console.error('Error fetching received orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all products listed by a farmer (paginated)
exports.getFarmerProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const farmerId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const farmer = await Farmer.findById(farmerId).populate('products'); // Populate directly from the products field

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Paginate the products
    const totalProducts = farmer.products.length; // Directly get the length of the populated products
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedProducts = farmer.products.slice(skip, skip + limit);

    res.json({
      products: paginatedProducts,
      currentPage: page,
      totalPages,
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};







// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const farmerId = req.user.userId; // Assuming you have middleware to authenticate and attach user info

    const product = await Product.findOne({ _id: productId, farmer: farmerId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to delete it' });
    }

    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const farmerId = req.user.userId; // Assuming you have middleware to authenticate and attach user info
    const updates = req.body;

    // Ensure the farmer can only update allowed fields
    const allowedUpdates = ['name', 'description', 'price', 'unit', 'smallestSellingUnit', 'isForSale', 'category'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
    console.log(req.user.userId)
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const product = await Product.findOne({ _id: productId, farmer: farmerId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to update it' });
    }

    Object.keys(updates).forEach(update => product[update] = updates[update]);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
