const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ 
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    storage: multer.memoryStorage() 
});

// POST /api/chat - Handle career guidance interaction with optional file upload (Global Access)
router.post('/', optionalProtect, upload.single('file'), chatController.handleChat);

module.exports = router;
