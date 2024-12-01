const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/auth');

router.post('/address',auth, addressController.addAddress);
router.put('/address/:addressId',auth, addressController.editAddress);
router.delete('/address/:addressId',auth, addressController.deleteAddress);
router.put('/address/:addressId/default',auth, addressController.setDefaultAddress);

module.exports = router;