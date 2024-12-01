const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const   router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes for both customers and farmers
    router.post('/change-password', auth, authorize(['customer', 'farmer']), authController.changePassword);
router.put('/update-personal-info', auth, authorize(['customer', 'farmer']), authController.updatePersonalInfo);

// Primary address routes for both customers and farmers
router.put('/update-primary-address', auth, authorize(['customer', 'farmer']), authController.updatePrimaryAddress); 

// Additional address routes for both customers and farmers
router.post('/add-additional-address', auth, authorize(['customer', 'farmer']), authController.addAdditionalAddress);
router.put('/update-additional-address/:addressId', auth, authorize(['customer', 'farmer']), authController.updateAdditionalAddress);
router.delete('/delete-additional-address/:addressId', auth, authorize(['customer', 'farmer']), authController.deleteAdditionalAddress);

module.exports = router;