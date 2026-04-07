const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  board: { type: String, required: true },
  schoolName: { type: String },
  yearsExperience: { type: Number },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
