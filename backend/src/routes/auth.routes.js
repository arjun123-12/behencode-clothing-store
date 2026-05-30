const express = require('express');
const authController = require('../controllers/auth/authController');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, admin, authController.getUsers);

module.exports = router;
