const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const ApiError = require('../utils/ApiError');

class OrderService {
  async createOrder({ customerDetails, items, paymentMethod, couponCode, user }) {
    if (!items || items.length === 0) {
      throw new ApiError(400, 'No items in order');
    }

    if (!customerDetails) {
      throw new ApiError(400, 'Please provide customer delivery details');
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await productRepository.findById(item.product);
      if (!product) {
        throw new ApiError(404, `Product ${item.product} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
      }

      const price = product.discountPrice || product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        size: item.size,
      });

      // Deduct stock
      product.stockQuantity -= item.quantity;
      product.inStock = product.stockQuantity > 0;
      await product.save();
    }

    let discountAmount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === 'WELCOME10') {
        discountAmount = Math.round(totalAmount * 0.1);
      } else if (code === 'FASHION20') {
        discountAmount = Math.round(totalAmount * 0.2);
      }
    }
    const finalAmount = Math.max(0, totalAmount - discountAmount);

    let isUnique = false;
    let orderId = '';
    while (!isUnique) {
      const digits = Math.floor(100000 + Math.random() * 900000);
      orderId = `BH-${digits}`;
      const existing = await orderRepository.findOne({ orderId });
      if (!existing) {
        isUnique = true;
      }
    }

    const paymentStatus = paymentMethod === 'card' ? 'Paid' : 'Pending';

    return await orderRepository.create({
      user: user ? user._id : null,
      orderId,
      customerDetails,
      items: processedItems,
      totalAmount: finalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Processing',
      couponCode: couponCode || null,
      discountAmount,
    });
  }

  async getOrders(queryParams) {
    const { status, search } = queryParams;
    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customerDetails.fullName': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
      ];
    }

    return await orderRepository.find(query);
  }

  async updateOrderStatus(id, orderStatus) {
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      throw new ApiError(400, 'Invalid order status');
    }

    const order = await orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    return await orderRepository.save(order);
  }
}

module.exports = new OrderService();
