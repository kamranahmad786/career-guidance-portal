const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  bio: { type: String, default: '' },
  className: { type: String, required: true },
  schoolName: { type: String, required: true },
  board: { type: String, default: 'CBSE' },
  profilePicture: { type: String, default: '' },
  interests: [{ type: String }],
  hobbies: [{ type: String }],
  skills: [{ type: String }],
  achievements: [{ 
    title: String,
    date: Date,
    description: String
  }],
  preferences: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
