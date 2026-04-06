const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getProfile)
  .post(protect, authorize('Student'), upsertProfile);

module.exports = router;
