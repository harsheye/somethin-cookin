const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/getitem',auth, cartController.getCartItems);
router.post('/additem',auth, cartController.addToCart);
router.delete('/removeitem/:productId',auth, cartController.removeFromCart);
router.put('/updateitem/:productId',auth, cartController.updateCartItemQuantity);
router.put('/updateitem/:productId/increment',auth, cartController.incrementCartItemQuantity);
router.put('/updateitem/:productId/decrement',auth, cartController.decrementCartItemQuantity);

module.exports = router;