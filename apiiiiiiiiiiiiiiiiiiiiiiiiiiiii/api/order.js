const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

router.post('/place', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart');
    let totalPrice = 0;

    for (const product of user.cart) {
      totalPrice += product.price;
    }

    const order = {
      items: user.cart.map(product => product._id),
      totalPrice,
      date: new Date()
    };

    user.orders.push(order);
    user.cart = [];
    await user.save();

    res.json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'An error occurred while placing the order' });
  }
});

module.exports = router;