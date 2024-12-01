// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const   router = express.Router();

router.get('/:userId', auth, authorize('admin', 'service_provider'), userController.getUserDetailsAdmin);
router.get('/',auth, userController.getUserDetails);

module.exports = router;
