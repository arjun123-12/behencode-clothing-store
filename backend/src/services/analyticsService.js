const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');

class AnalyticsService {
  async getDashboardOverview() {
    const products = await productRepository.find();
    const orders = await orderRepository.find();
    const users = await userRepository.find();

    const totalProducts = products.length;
    const outOfStockCount = products.filter((p) => (p.stockQuantity || 0) <= 0).length;
    const messagesCount = 2; // Fixed legacy mock inbox defaults

    // Exclude cancelled order revenue
    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalOrdersCount = orders.length;

    return {
      totalProducts,
      outOfStockCount,
      messagesCount,
      totalRevenue,
      totalOrdersCount,
      usersCount: users.length,
    };
  }
}

module.exports = new AnalyticsService();
