const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Specialized Courses', 'Live Workshops', 'Expert Webinars', 'Career Simulations'], 
    required: true 
  },
  imageUrl: { type: String, required: true },
  contentUrl: { type: String, required: true }, // This will be gated
  duration: { type: String },
  modules: { type: Number, default: 1 },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  rating: { type: Number, default: 4.5 },
  enrolledCount: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: true }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
