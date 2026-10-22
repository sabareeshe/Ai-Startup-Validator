// ============================================================
// models/StartupIdea.js — Startup Idea Schema
// ============================================================
// Stores all startup idea submissions with comprehensive
// fields for AI validation analysis.
// ============================================================

const mongoose = require('mongoose');

const startupIdeaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [100, 'Startup name cannot exceed 100 characters'],
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
  },
  startupStage: {
    type: String,
    required: [true, 'Startup stage is required'],
    enum: ['Idea', 'MVP', 'Early Stage', 'Growth', 'Scale', 'Mature'],
  },
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    maxlength: [2000, 'Problem statement cannot exceed 2000 characters'],
  },
  proposedSolution: {
    type: String,
    required: [true, 'Proposed solution is required'],
    maxlength: [2000, 'Proposed solution cannot exceed 2000 characters'],
  },
  uniqueSellingProposition: {
    type: String,
    required: [true, 'USP is required'],
    maxlength: [1000, 'USP cannot exceed 1000 characters'],
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    maxlength: [500, 'Target audience cannot exceed 500 characters'],
  },
  revenueModel: {
    type: String,
    required: [true, 'Revenue model is required'],
    trim: true,
  },
  businessModel: {
    type: String,
    required: [true, 'Business model is required'],
    trim: true,
  },
  competitors: {
    type: String,
    default: '',
    maxlength: [1000, 'Competitors cannot exceed 1000 characters'],
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    trim: true,
  },
  teamSize: {
    type: String,
    required: [true, 'Team size is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  additionalNotes: {
    type: String,
    default: '',
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters'],
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
startupIdeaSchema.index({ user: 1, createdAt: -1 });
startupIdeaSchema.index({ industry: 1 });
startupIdeaSchema.index({ startupName: 'text', industry: 'text' });

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);
