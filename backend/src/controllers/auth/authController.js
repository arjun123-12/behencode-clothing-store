const authService = require('../../services/authService');
const ApiResponse = require('../../utils/ApiResponse');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, { user: req.user }, 'User profile retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await authService.getUsers();
    res.status(200).json(new ApiResponse(200, { count: users.length, users }, 'Registered users retrieved'));
  } catch (error) {
    next(error);
  }
};
