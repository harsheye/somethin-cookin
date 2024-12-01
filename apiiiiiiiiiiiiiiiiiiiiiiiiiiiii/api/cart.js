const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart');
    res.json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart' });
  }
});

router.post('/add', async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    await User.findByIdAndUpdate(req.user.userId, { $addToSet: { cart: productId } });
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding to the cart' });
  }
});

module.exports = router;