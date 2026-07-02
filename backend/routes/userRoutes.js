const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// GET /api/users - All users (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;