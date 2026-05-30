const ApiError = require('../utils/ApiError');

const createOrderValidator = (req, res, next) => {
  const { customerDetails, items, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return next(new ApiError(400, 'No items in order'));
  }
  if (!customerDetails || !customerDetails.fullName || !customerDetails.email || !customerDetails.address || !customerDetails.city || !customerDetails.pincode) {
    return next(new ApiError(400, 'Complete customer details and shipping address are required'));
  }
  if (!paymentMethod) {
    return next(new ApiError(400, 'Payment method is required'));
  }
  next();
};

module.exports = {
  createOrderValidator,
};
