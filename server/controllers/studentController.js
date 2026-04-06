const StudentProfile = require('../models/StudentProfile');

// @desc    Create or update student profile
// @route   POST /api/student/profile
// @access  Private (Student only)
exports.upsertProfile = async (req, res) => {
  const { age, bio, className, schoolName, board, profilePicture, interests, hobbies, skills, achievements, preferences } = req.body;

  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      if (age) profile.age = age;
      if (bio !== undefined) profile.bio = bio;
      if (className) profile.className = className;
      if (schoolName) profile.schoolName = schoolName;
      if (board) profile.board = board;
      if (profilePicture) profile.profilePicture = profilePicture;
      if (interests) profile.interests = interests;
      if (hobbies) profile.hobbies = hobbies;
      if (skills) profile.skills = skills;
      if (achievements) profile.achievements = achievements;
      if (preferences) profile.preferences = preferences;

      const updatedProfile = await profile.save();
      return res.json(updatedProfile);
    } else {
      // Create
      profile = await StudentProfile.create({
        user: req.user._id,
        age,
        bio,
        className,
        schoolName,
        board,
        profilePicture,
        interests,
        hobbies,
        skills,
        achievements,
        preferences
      });

      return res.status(201).json(profile);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
