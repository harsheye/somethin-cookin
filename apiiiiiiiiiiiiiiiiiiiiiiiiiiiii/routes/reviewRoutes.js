const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { hasOrderedProduct } = require('../middleware/reviewMiddleware');

// Add a review
router.post('/add-review', auth,authorize(['customer']),  reviewController.addReview);

// Get product reviews
router.get('/product-reviews/:productId', reviewController.getProductReviews);

// Update a review
router.put('/update-review/:productId', auth, authorize(['customer']),  reviewController.updateReview);

// Delete a review
router.delete('/delete-review/:productId', auth, authorize(['admin','customer']), reviewController.deleteReview);

module.exports = router;
