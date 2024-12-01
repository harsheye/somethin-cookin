const express = require('express');
const router = express.Router();
const sendEmailController = require('../controllers/sendEmailController');

// Route for sending a verification code via email
router.post('/send-code', sendEmailController.sendVerificationCode);

module.exports = router;
