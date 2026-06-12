const express = require('express');
const orderController = require('../controllers/orders/orderController');
const { createOrderValidator } = require('../validators/order.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.route('/')
  .post(validate(createOrderValidator), orderController.createOrder)
  .get(protect, admin, orderController.getOrders);

router.route('/verify')
  .post(orderController.verifyPayment);

router.route('/:id/status')
  .put(protect, admin, orderController.updateOrderStatus);

module.exports = router;
