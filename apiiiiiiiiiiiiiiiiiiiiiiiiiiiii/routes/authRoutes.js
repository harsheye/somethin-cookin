const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Verification routes
router.post('/send-verification', verificationController.sendVerificationEmail);
router.post('/verify-email', verificationController.verifyEmail);

// Protected routes
router.post('/change-password', auth, authorize(['customer', 'farmer']), authController.changePassword);
router.put('/update-personal-info', auth, authorize(['customer', 'farmer']), authController.updatePersonalInfo);

module.exports = router;