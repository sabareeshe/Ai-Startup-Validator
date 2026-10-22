// ============================================================
// models/ChatHistory.js — AI Chat History Schema
// ============================================================
// Stores chat conversations between users and the AI assistant
// in the context of specific startup ideas.
// ============================================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupIdea',
    required: true,
  },
  messages: [messageSchema],
}, {
  timestamps: true,
});

// Index for efficient querying
chatHistorySchema.index({ user: 1, startup: 1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
