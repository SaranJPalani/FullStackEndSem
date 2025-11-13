const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  updateFlashSale,
  getLowStock,
  getLeaderboard
} = require('../controllers/adminController');
const {
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/analytics', protect, admin, getAnalytics);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);
router.put('/products/:id/flash-sale', protect, admin, updateFlashSale);
router.get('/low-stock', protect, admin, getLowStock);
router.get('/leaderboard', protect, admin, getLeaderboard);

module.exports = router;
