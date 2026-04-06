const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  parameter: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      parameter: { type: String, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
