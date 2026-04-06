const express = require('express');
const router = express.Router();
const { getAllResources, seedResources } = require('../controllers/resourceController');

// Public route that handles internal gating logic
router.get('/', getAllResources);

// Development/Seeding route
router.post('/seed', seedResources);

module.exports = router;
