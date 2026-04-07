const mongoose = require('mongoose');

const parentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childName: { type: String, required: true },
  childGrade: { type: String, required: true },
  occupation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ParentProfile', parentProfileSchema);
