const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      parameter: { type: String, required: true }
    }
  ],
  parameterScores: { type: Map, of: Number }, 
  topParameters: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
