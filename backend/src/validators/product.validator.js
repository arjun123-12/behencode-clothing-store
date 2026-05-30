const ApiError = require('../utils/ApiError');

const createProductValidator = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return next(new ApiError(400, 'Product name and price are required'));
  }
  if (isNaN(Number(price)) || Number(price) <= 0) {
    return next(new ApiError(400, 'Please enter a valid price greater than zero'));
  }
  next();
};

module.exports = {
  createProductValidator,
};
