const authService = require('../../services/authService');
const ApiResponse = require('../../utils/ApiResponse');

exports.getUsersList = async (req, res, next) => {
  try {
    const users = await authService.getUsers();
    res.status(200).json(new ApiResponse(200, { count: users.length, users }, 'Users registry retrieved'));
  } catch (error) {
    next(error);
  }
};
