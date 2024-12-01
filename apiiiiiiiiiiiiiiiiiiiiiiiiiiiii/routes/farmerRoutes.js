// routes/farmerRoutes.js
const express = require('express');
const farmerController = require('../controllers/farmerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/products', auth, authorize('farmer'), farmerController.addProduct);
router.get('/orders', auth, authorize('farmer'), farmerController.getReceivedOrders);
// New routes
router.get('/products', auth, authorize('farmer'), farmerController.getFarmerProducts);


router.delete('/products/:id',  auth, authorize('farmer'),farmerController.deleteProduct);
router.patch('/products/:id',  auth, authorize('farmer'), farmerController.updateProduct);

module.exports = router;