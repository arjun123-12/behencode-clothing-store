const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Fallback to internal error if status is not structured
  if (!statusCode) {
    statusCode = 500;
    message = err.message || 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('API Error Intercepted:', err);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
