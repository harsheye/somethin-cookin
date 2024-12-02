const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tradeController = require('../controllers/tradeController');

// Create trade route
router.post('/create', auth, tradeController.createTrade);
// Fetch trades route
router.get('/', auth, tradeController.getTrades);
module.exports = router;
