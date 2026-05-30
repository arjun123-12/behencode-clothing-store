const ApiError = require('../utils/ApiError');
const ROLES = require('../constants/roles');

const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    next(new ApiError(403, 'Forbidden, administrator privileges required'));
  }
};

module.exports = admin;
