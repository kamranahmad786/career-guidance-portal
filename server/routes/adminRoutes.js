const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/adminController');

// All routes require SuperAdmin or Admin authority
router.use(protect);
router.use(authorize('SuperAdmin', 'Admin'));

// Dashboard
router.get('/stats', ctrl.getDashboardStats);
router.get('/analytics', ctrl.getAnalyticsData);
router.get('/alerts', ctrl.getRecentAlerts);

// User Management
router.get('/users', ctrl.getUsers);
router.put('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

// Students
router.get('/students', ctrl.getStudents);

// Teachers
router.get('/teachers', ctrl.getTeachers);

// Parents
router.get('/parents', ctrl.getParents);

// Quizzes
router.get('/quizzes', ctrl.getQuizzes);
router.delete('/quizzes/:id', ctrl.deleteQuiz);

// Resources / Courses
router.get('/resources', ctrl.getResources);
router.delete('/resources/:id', ctrl.deleteResource);

// Events / Activities
router.get('/events', ctrl.getEvents);
router.delete('/events/:id', ctrl.deleteEvent);

// AI System
router.get('/ai-status', ctrl.getAIStatus);

// Configuration & Global Search
router.get('/config', ctrl.getSystemConfig);
router.put('/config', ctrl.updateSystemConfig);
router.get('/search', ctrl.globalSearch);

// Reports
router.get('/reports', ctrl.getReports);

// Notifications
router.get('/notifications', ctrl.getAdminNotifications);
router.post('/notifications/broadcast', ctrl.broadcastNotification);

module.exports = router;
