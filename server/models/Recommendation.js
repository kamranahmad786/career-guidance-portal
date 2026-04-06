const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topParameters: [{ type: String, required: true }],
  careers: [{ type: String, required: true }],
  courses: [{ type: String, required: true }],
  roadmap: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
