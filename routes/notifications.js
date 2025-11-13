const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
