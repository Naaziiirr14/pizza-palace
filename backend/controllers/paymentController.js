const crypto = require('node:crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

// Razorpay lazy load - Node.js v24 fix
const getRazorpay = () => {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payment/create-order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty.' 
      });
    }

    // Amount calculate பண்ணு
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizzaId || item.pizza);
      if (!pizza || !pizza.isAvailable) {
        return res.status(400).json({ 
          success: false, 
          message: `${pizza?.name || 'A pizza'} is unavailable.` 
        });
      }
      orderItems.push({ 
        pizza: pizza._id, 
        qty: item.qty, 
        price: pizza.price 
      });
      totalAmount += pizza.price * item.qty;
    }

    // Razorpay order create பண்ணு
    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // DB-ல order save பண்ணு
    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      status: 'Pending',
    });

    // Payment record save பண்ணு
    const payment = await Payment.create({
      userId: req.user._id,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
    });

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      paymentId: payment._id,
      amount: totalAmount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/payment/verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderId 
    } = req.body;

    // Signature verify பண்ணு
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed.' 
      });
    }

    // Payment update பண்ணு
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        razorpayPaymentId: razorpay_payment_id, 
        razorpaySignature: razorpay_signature, 
        status: 'success' 
      },
      { new: true }
    );

    // Order confirm பண்ணு
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Confirmed' },
      { new: true }
    ).populate('items.pizza', 'name price');

    res.json({ 
      success: true, 
      message: 'Payment verified. Order confirmed!', 
      payment, 
      order 
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/payment/all - Admin மட்டும்
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('orderId', 'totalAmount status')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: payments.length, 
      payments 
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/payment/my - Customer orders
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('orderId', 'totalAmount status createdAt')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: payments.length, 
      payments 
    });

  } catch (error) {
    next(error);
  }
};