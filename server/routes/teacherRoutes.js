const express = require('express');
const router = express.Router();
const { 
    getTeacherDashboardStats,
    getStudentsList, 
    generateAIQuiz,
    getFullStudentRoster,
    getSchoolEvents,
    createSchoolEvent,
    deleteSchoolEvent,
    getRecentQuizzes,
    searchGlobal
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All teacher routes are protected and restricted to 'Teacher' role
router.get('/dashboard', protect, authorize('Teacher'), getTeacherDashboardStats);
router.get('/students', protect, authorize('Teacher'), getStudentsList);
router.get('/roster', protect, authorize('Teacher'), getFullStudentRoster);
router.get('/events', protect, authorize('Teacher'), getSchoolEvents);
router.post('/events', protect, authorize('Teacher'), createSchoolEvent);
router.delete('/events/:id', protect, authorize('Teacher'), deleteSchoolEvent);
router.get('/quizzes', protect, authorize('Teacher'), getRecentQuizzes);
router.post('/generate-quiz', protect, authorize('Teacher'), generateAIQuiz);
router.get('/search', protect, authorize('Teacher'), searchGlobal);

module.exports = router;
