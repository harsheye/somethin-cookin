const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// All your routes referencing the controller
// router.get('/recommended-words', productController.getRecommendedWords);



router.get('/recommend-and-search', productController.getRecommendedProductsWithSearch);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getSpecificProduct);
router.get('/', productController.getProductsByTimestamp);

module.exports = router;
