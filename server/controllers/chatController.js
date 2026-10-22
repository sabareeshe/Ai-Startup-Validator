// ============================================================
// controllers/chatController.js — AI Chat Controller
// ============================================================
// Manages AI chat conversations in the context of specific
// startup ideas, with history persistence.
// ============================================================

const ChatHistory = require('../models/ChatHistory');
const StartupIdea = require('../models/StartupIdea');
const ApiError = require('../utils/apiError');
const { asyncHandler } = require('../utils/helpers');
const { chatWithAI } = require('../services/geminiService');

/**
 * POST /api/chat/:startupId
 * Send a message to the AI chat assistant
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError('Message is required.', 400);
  }

  // Verify startup belongs to user
  const startup = await StartupIdea.findOne({
    _id: req.params.startupId,
    user: req.user._id,
  });

  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  // Get or create chat history
  let chatHistory = await ChatHistory.findOne({
    user: req.user._id,
    startup: startup._id,
  });

  if (!chatHistory) {
    chatHistory = await ChatHistory.create({
      user: req.user._id,
      startup: startup._id,
      messages: [],
    });
  }

  // Add user message
  chatHistory.messages.push({ role: 'user', content: message });

  // Prepare messages for AI (include recent context, limit to last 20 messages)
  const recentMessages = chatHistory.messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Get AI response
  const aiResponse = await chatWithAI(recentMessages, startup.toObject());

  // Add AI response to history
  chatHistory.messages.push({ role: 'assistant', content: aiResponse });
  await chatHistory.save();

  res.json({
    success: true,
    message: aiResponse,
    chatHistory: {
      id: chatHistory._id,
      messageCount: chatHistory.messages.length,
    },
  });
});

/**
 * GET /api/chat/:startupId
 * Get chat history for a specific startup
 */
const getChatHistory = asyncHandler(async (req, res) => {
  const chatHistory = await ChatHistory.findOne({
    user: req.user._id,
    startup: req.params.startupId,
  }).populate('startup', 'startupName industry');

  res.json({
    success: true,
    chatHistory: chatHistory || { messages: [] },
  });
});

/**
 * DELETE /api/chat/:startupId
 * Clear chat history for a specific startup
 */
const clearChatHistory = asyncHandler(async (req, res) => {
  await ChatHistory.findOneAndDelete({
    user: req.user._id,
    startup: req.params.startupId,
  });

  res.json({
    success: true,
    message: 'Chat history cleared.',
  });
});

/**
 * GET /api/chat
 * Get all chat sessions for the current user
 */
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await ChatHistory.find({ user: req.user._id })
    .populate('startup', 'startupName industry')
    .sort({ updatedAt: -1 });

  res.json({
    success: true,
    chats,
  });
});

module.exports = { sendMessage, getChatHistory, clearChatHistory, getAllChats };
