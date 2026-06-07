const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getAllPayments } = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-payment', verifyToken, verifyPayment);
router.get('/all', verifyToken, isAdmin, getAllPayments);

module.exports = router;
