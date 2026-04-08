const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  school: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String, 
    required: true,
    default: 'School Auditorium'
  },
  type: { 
    type: String, 
    enum: ['Workshop', 'Seminar', 'Career Day', 'Skill Lab', 'Olympiad'],
    default: 'Workshop'
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
