const express = require('express');
const productController = require('../controllers/products/productController');
const { createProductValidator } = require('../validators/product.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(productController.getProducts)
  .post(protect, admin, upload.array('images', 5), validate(createProductValidator), productController.createProduct);

router.route('/:id')
  .get(productController.getProduct)
  .put(protect, admin, upload.array('images', 5), productController.updateProduct)
  .delete(protect, admin, productController.deleteProduct);

module.exports = router;
