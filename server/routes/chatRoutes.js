const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Handle career guidance interaction
router.post('/', chatController.handleChat);

module.exports = router;
