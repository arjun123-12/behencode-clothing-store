const Review = require('../../models/Review');
const Product = require('../../models/Product');
const mongoose = require('mongoose');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');

// Helper to update product average rating
const updateProductRatingStats = async (productId) => {
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0,
    });
    return;
  }

  const numReviews = reviews.length;
  const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  const rating = Math.round((totalRating / numReviews) * 10) / 10;

  await Product.findByIdAndUpdate(productId, {
    rating,
    numReviews,
  });
};

exports.createProductReview = async (req, res, next) => {
  try {
    const { name, email, rating, comment } = req.body;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    if (!name || !email || !rating || !comment) {
      throw new ApiError(400, 'Please provide all review details');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const review = await Review.create({
      product: productId,
      name,
      email,
      rating: Number(rating),
      comment,
    });

    await updateProductRatingStats(productId);

    res.status(201).json(new ApiResponse(201, { review }, 'Review added successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, 'Invalid product ID');
    }

    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, { count: reviews.length, reviews }, 'Reviews retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.getReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images price')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, { count: reviews.length, reviews }, 'All reviews retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    const productId = review.product;
    await review.deleteOne();

    await updateProductRatingStats(productId);

    res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
  } catch (error) {
    next(error);
  }
};
