// ============================================================
// models/ValidationReport.js — AI Validation Report Schema
// ============================================================
// Stores the complete AI-generated validation report for each
// startup idea, including all scores, analyses, and recommendations.
// ============================================================

const mongoose = require('mongoose');

const validationReportSchema = new mongoose.Schema({
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupIdea',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // --- Core Scores ---
  executiveSummary: { type: String, default: '' },
  innovationScore: { type: Number, default: 0, min: 0, max: 100 },
  marketPotentialScore: { type: Number, default: 0, min: 0, max: 100 },
  scalabilityScore: { type: Number, default: 0, min: 0, max: 100 },
  technicalFeasibility: { type: String, default: '' },
  productMarketFit: { type: String, default: '' },
  customerValidation: { type: String, default: '' },
  competitiveAnalysis: { type: String, default: '' },

  // --- SWOT Analysis ---
  swotAnalysis: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    opportunities: [{ type: String }],
    threats: [{ type: String }],
  },

  // --- Risk & Business ---
  risks: [{ type: String }],
  businessModelAnalysis: { type: String, default: '' },
  revenueSuggestions: { type: String, default: '' },
  pricingSuggestions: { type: String, default: '' },

  // --- Strategy ---
  marketingStrategy: { type: String, default: '' },
  customerAcquisitionStrategy: { type: String, default: '' },
  goToMarketPlan: { type: String, default: '' },

  // --- Technical ---
  mvpRoadmap: { type: String, default: '' },
  recommendedTechStack: { type: String, default: '' },
  estimatedDevTimeline: { type: String, default: '' },
  estimatedDevCost: { type: String, default: '' },

  // --- Funding & Verdict ---
  fundingSuggestions: { type: String, default: '' },
  investorReadinessScore: { type: Number, default: 0, min: 0, max: 100 },
  successProbability: { type: Number, default: 0, min: 0, max: 100 },
  finalVerdict: { type: String, default: '' },
  aiRecommendations: [{ type: String }],
}, {
  timestamps: true,
});

// Index for efficient querying
validationReportSchema.index({ user: 1, createdAt: -1 });
validationReportSchema.index({ startup: 1 });

module.exports = mongoose.model('ValidationReport', validationReportSchema);
