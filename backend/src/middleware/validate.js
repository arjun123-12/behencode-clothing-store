const ApiError = require('../utils/ApiError');

// Direct validator runner wrapper (custom validation helper gateway)
const validate = (schemaValidator) => {
  return (req, res, next) => {
    schemaValidator(req, res, next);
  };
};

module.exports = validate;
