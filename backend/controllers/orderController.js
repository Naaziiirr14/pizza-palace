const Order = require('../models/Order');
const Pizza = require('../models/Pizza');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    // Validate pizzas and compute total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizzaId);
      if (!pizza) return res.status(404).json({ success: false, message: `Pizza ${item.pizzaId} not found.` });
      if (!pizza.isAvailable) return res.status(400).json({ success: false, message: `${pizza.name} is currently unavailable.` });

      orderItems.push({ pizza: pizza._id, qty: item.qty, price: pizza.price });
      totalAmount += pizza.price * item.qty;
    }

    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      status: 'Pending',
    });

    const populated = await order.populate('items.pizza', 'name imageUrl price');
    res.status(201).json({ success: true, message: 'Order placed successfully.', order: populated });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('items.pizza', 'name imageUrl price category')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders  [Admin]
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('items.pizza', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status  [Admin]
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (req.user.role !== 'admin' && order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (order.status !== 'Pending' && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled.' });
    }

    order.status = 'Cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled.' });
  } catch (error) {
    next(error);
  }
};
