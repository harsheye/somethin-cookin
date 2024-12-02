// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Authentication middleware
const companyController = require('../controllers/companyController');

// Register Company
router.post('/register', companyController.registerCompany);

// Login Company
router.post('/login', companyController.loginCompany);

// Get Company Trades (Won or Accepted)
router.get('/trades', auth, companyController.getTrades);

// Get Company Orders (Placed)
router.get('/orders', auth, companyController.getOrders);

module.exports = router;
