const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register({ username, email, password, role }) {
    const emailExists = await userRepository.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, 'Email already registered');
    }

    const usernameExists = await userRepository.findOne({ username });
    if (usernameExists) {
      throw new ApiError(400, 'Username is already taken');
    }

    const user = await userRepository.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, 'Please provide an email and password');
    }

    const user = await userRepository.findOne({ email }, '+password');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  }

  async getUsers() {
    return await userRepository.find();
  }
}

module.exports = new AuthService();
