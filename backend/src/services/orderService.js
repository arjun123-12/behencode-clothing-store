const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

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

    let paymentStatus = 'Pending';
    let razorpayOrderId = null;
    let razorpayOrderDetails = null;

    if (paymentMethod === 'card') {
      if (razorpay) {
        try {
          const options = {
            amount: Math.round(finalAmount * 100), // in paise
            currency: 'INR',
            receipt: orderId,
          };
          const rpOrder = await razorpay.orders.create(options);
          razorpayOrderId = rpOrder.id;
          razorpayOrderDetails = {
            id: rpOrder.id,
            amount: rpOrder.amount,
            currency: rpOrder.currency,
          };
        } catch (rpErr) {
          console.error('[ERROR]: Razorpay order creation failed:', rpErr);
          throw new ApiError(500, `Razorpay setup failed: ${rpErr.message}`);
        }
      } else {
        console.warn('[WARN]: Razorpay credentials missing. Falling back to simulated instant payment.');
        paymentStatus = 'Paid';
      }
    }

    const order = await orderRepository.create({
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
      razorpayOrderId,
    });

    const orderObj = order.toObject();
    if (razorpayOrderDetails) {
      orderObj.razorpayOrder = razorpayOrderDetails;
    }
    return orderObj;
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

  async verifyPayment({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, 'Payment verification credentials missing');
    }

    const order = await orderRepository.findOne({ orderId });
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new ApiError(500, 'Razorpay key secret not configured on server');
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      throw new ApiError(400, 'Invalid payment signature');
    }

    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    if (!order.razorpayOrderId) {
      order.razorpayOrderId = razorpay_order_id;
    }

    return await orderRepository.save(order);
  }
}

module.exports = new OrderService();
