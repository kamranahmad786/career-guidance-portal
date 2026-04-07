const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * All Parent Routes are Protected & Restricted to 'Parent' role
 */
router.use(protect);
router.use(authorize('Parent'));

// POST /api/parent/link-child - Link a student by email
router.post('/link-child', parentController.linkChildByEmail);

// GET /api/parent/dashboard - Fetch all dashboard data
router.get('/dashboard', parentController.getParentDashboardData);

// PATCH /api/parent/notifications - Update notification preferences
router.patch('/notifications', parentController.updateNotificationPrefs);

module.exports = router;
