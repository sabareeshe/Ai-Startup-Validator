// ============================================================
// routes/chatRoutes.js — AI Chat Routes
// ============================================================

const express = require('express');
const { sendMessage, getChatHistory, clearChatHistory, getAllChats } = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/chat — Get all chat sessions
router.get('/', getAllChats);

// POST /api/chat/:startupId — Send a message
router.post('/:startupId', sendMessage);

// GET /api/chat/:startupId — Get chat history
router.get('/:startupId', getChatHistory);

// DELETE /api/chat/:startupId — Clear chat history
router.delete('/:startupId', clearChatHistory);

module.exports = router;
