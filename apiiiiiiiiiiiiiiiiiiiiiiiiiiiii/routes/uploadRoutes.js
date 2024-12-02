const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadSelfie, handleSelfieUpload } = require('../controllers/fileuploadController');

// Selfie upload route
router.post('/selfie', auth, uploadSelfie, handleSelfieUpload);

module.exports = router; 