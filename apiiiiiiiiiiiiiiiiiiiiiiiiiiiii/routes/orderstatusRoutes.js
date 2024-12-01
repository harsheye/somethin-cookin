const express = require('express');
const router = express.Router();
const orderstatusController = require('../controllers/orderstatusController');

// Middleware to authenticate and authorize users
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Routes for farmer
router.put('/orders/:orderId/packed', auth, orderstatusController.markOrderAsPacked);
router.put('/orders/:orderId/shipped', auth, orderstatusController.markOrderAsShipped);

// Routes for driver
router.put('/orders/:orderId/delivered', auth, orderstatusController.markOrderAsDelivered);

module.exports = router;
