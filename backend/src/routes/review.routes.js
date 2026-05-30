const express = require('express');
const reviewController = require('../controllers/reviews/reviewController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.route('/')
  .get(protect, admin, reviewController.getReviewsAdmin);

router.route('/product/:productId')
  .get(reviewController.getProductReviews)
  .post(reviewController.createProductReview);

router.route('/:id')
  .delete(protect, admin, reviewController.deleteReview);

module.exports = router;
