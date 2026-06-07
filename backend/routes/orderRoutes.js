// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getMyOrders);
router.get('/', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, deleteOrder);

module.exports = router;
