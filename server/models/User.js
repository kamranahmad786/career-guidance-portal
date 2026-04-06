const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  grade: { type: String, default: 'Not specified' },
  school: { type: String, default: 'Not specified' },
  academicInterests: [{ type: String }],
  role: { 
    type: String, 
    enum: ['Student', 'Parent', 'Teacher', 'SuperAdmin'], 
    default: 'Student' 
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  privacy: {
    profilePublic: { type: Boolean, default: false },
    showAnalytics: { type: Boolean, default: true },
    dataSharing: { type: Boolean, default: true }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
