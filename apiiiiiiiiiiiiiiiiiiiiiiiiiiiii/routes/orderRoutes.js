// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/place', auth, orderController.createOrder);
router.post('/search/:orderId', auth, orderController.getOrderById);


module.exports = router;