const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for the logged-in student
router.get('/', protect, notificationController.getMyNotifications);

// Mark a single notification as read
router.patch('/:id/read', protect, notificationController.markAsRead);

// Mark all as read
router.post('/read-all', protect, notificationController.markAllAsRead);

module.exports = router;
