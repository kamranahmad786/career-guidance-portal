const Recommendation = require('../models/Recommendation');
const Result = require('../models/Result');
const { getRecommendations } = require('../services/recommendationService');

// @desc    Generate career recommendations based on quiz results
// @route   POST /api/recommendation/generate
// @access  Private (Student)
exports.generateRecommendation = async (req, res) => {
  try {
    // 1. Fetch latest quiz result for the student
    const latestResult = await Result.findOne({ studentId: req.user._id }).sort({ createdAt: -1 });
    
    if (!latestResult) {
      return res.status(404).json({ message: 'No quiz result found. Please take the interest quiz first.' });
    }

    // 2. Generate data-driven recommendations using our service
    const { careers, courses, roadmap } = getRecommendations(latestResult.topParameters);

    // 3. Save recommendations
    const recommendation = await Recommendation.create({
      studentId: req.user._id,
      topParameters: latestResult.topParameters,
      careers,
      courses,
      roadmap
    });

    res.status(201).json(recommendation);

  } catch (error) {
    console.error("Recommendation generation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Latest Recommendation for current student
// @route   GET /api/recommendation/my
// @access  Private (Student)
exports.getMyRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ studentId: req.user._id }).sort({ createdAt: -1 });
    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendations found' });
    }
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Recommendation for a student by ID
// @route   GET /api/recommendation/:studentId
// @access  Private
exports.getStudentRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    if (!recommendation) {
      return res.status(404).json({ message: 'No recommendations found for this student' });
    }
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
