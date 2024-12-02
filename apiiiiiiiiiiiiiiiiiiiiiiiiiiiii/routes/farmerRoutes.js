// routes/farmerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const farmerController = require('../controllers/farmerController');

// Farmer routes
router.post('/products', auth, farmerController.addProduct);
router.get('/products', auth, farmerController.getFarmerProducts);
router.get('/orders', auth, farmerController.getReceivedOrders);
router.delete('/products/:id', auth, farmerController.deleteProduct);
router.put('/products/:id', auth, farmerController.updateProduct);

module.exports = router;  // Export the router