const ApiError = require('../utils/ApiError');

const registerValidator = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ApiError(400, 'Username, email, and password are required'));
  }
  if (password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters'));
  }
  if (!email.includes('@')) {
    return next(new ApiError(400, 'Please enter a valid email address'));
  }
  next();
};

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'Please provide an email and password'));
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
};
