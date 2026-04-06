const express = require('express');
const router = express.Router();
const { 
    submitQuiz, 
    getAllQuizzes, 
    getQuizResult, 
    getMyResults,
    seedMockQuestions 
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student submits their assessment here
router.post('/submit', protect, submitQuiz);

// TEMPORARY: Seed data via browser to bypass terminal DNS issues
router.get('/seed-mock', seedMockQuestions);

// Student and Admin can both view all questions to take/manage assessments
router.get('/all', protect, getAllQuizzes);
router.get('/result/:studentId', protect, getQuizResult);

// Student can view their own score history
router.get('/results/my', protect, getMyResults);

module.exports = router;
