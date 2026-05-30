const Order = require('../models/Order');

class OrderRepository {
  async find(query = {}, sort = { createdAt: -1 }) {
    return await Order.find(query)
      .populate('items.product', 'images')
      .sort(sort);
  }

  async findById(id) {
    return await Order.findById(id).populate('items.product', 'images');
  }

  async findOne(query) {
    return await Order.findOne(query);
  }

  async create(data) {
    return await Order.create(data);
  }

  async save(orderInstance) {
    return await orderInstance.save();
  }
}

module.exports = new OrderRepository();
