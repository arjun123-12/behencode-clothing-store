const express = require('express');
const categoryController = require('../controllers/categories/categoryController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.route('/')
  .get(categoryController.getCategories)
  .post(protect, admin, categoryController.createCategory);

router.route('/:id')
  .delete(protect, admin, categoryController.deleteCategory);

module.exports = router;
