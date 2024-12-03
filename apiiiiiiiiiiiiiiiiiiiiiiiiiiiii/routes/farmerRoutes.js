// routes/farmerRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const farmerController = require('../controllers/farmerController');

// Protect all farmer routes
router.use(auth);
router.use(authorize('farmer'));

// Farmer routes
router.post('/products', farmerController.addProduct);
router.get('/products', farmerController.getFarmerProducts);
router.get('/orders', farmerController.getReceivedOrders);
router.delete('/products/:id', farmerController.deleteProduct);
router.put('/products/:id', farmerController.updateProduct);

module.exports = router;  // Export the router