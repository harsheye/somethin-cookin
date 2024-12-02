const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/send-verification-email', otpController.sendVerificationEmail);
router.post('/verify-email', otpController.verifyEmail);

module.exports = router; 