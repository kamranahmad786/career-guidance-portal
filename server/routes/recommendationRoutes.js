const express = require('express');
const router = express.Router();
const { 
    generateRecommendation, 
    getMyRecommendation, 
    getStudentRecommendation 
} = require('../controllers/recommendationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student triggers their personalized career report here
router.post('/generate', protect, generateRecommendation);

// Student fetches their latest career report
router.get('/my', protect, getMyRecommendation);

// Admins/Teachers fetch a specific student's report
router.get('/student/:studentId', protect, authorize('SuperAdmin', 'Teacher'), getStudentRecommendation);

module.exports = router;
