const orderService = require('../../services/orderService');
const ApiResponse = require('../../utils/ApiResponse');

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder({
      customerDetails: req.body.customerDetails,
      items: req.body.items,
      paymentMethod: req.body.paymentMethod,
      couponCode: req.body.couponCode,
      user: req.user,
    });
    res.status(201).json(new ApiResponse(201, { order }, 'Order placed successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.query);
    res.status(200).json(new ApiResponse(200, { count: orders.length, orders }, 'Orders logs retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.orderStatus);
    res.status(200).json(new ApiResponse(200, { order }, 'Order shipment status updated successfully'));
  } catch (error) {
    next(error);
  }
};
