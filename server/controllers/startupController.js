// ============================================================
// controllers/startupController.js — Startup CRUD Controller
// ============================================================
// Full CRUD operations for startup ideas with search, filter,
// and pagination support.
// ============================================================

const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const ChatHistory = require('../models/ChatHistory');
const ApiError = require('../utils/apiError');
const { asyncHandler } = require('../utils/helpers');

/**
 * POST /api/startups
 * Create a new startup idea
 */
const createStartup = asyncHandler(async (req, res) => {
  const startupData = { ...req.body, user: req.user._id };
  const startup = await StartupIdea.create(startupData);

  res.status(201).json({
    success: true,
    message: 'Startup idea created successfully.',
    startup,
  });
});

/**
 * GET /api/startups
 * List all startup ideas for the current user with search, filter, pagination
 */
const getStartups = asyncHandler(async (req, res) => {
  const { search, industry, sortBy, order, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  // Search by name or industry
  if (search) {
    query.$or = [
      { startupName: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by industry
  if (industry) {
    query.industry = { $regex: industry, $options: 'i' };
  }

  // Sort
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [startups, total] = await Promise.all([
    StartupIdea.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)),
    StartupIdea.countDocuments(query),
  ]);

  res.json({
    success: true,
    startups,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * GET /api/startups/:id
 * Get a single startup idea
 */
const getStartup = asyncHandler(async (req, res) => {
  const startup = await StartupIdea.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  res.json({ success: true, startup });
});

/**
 * PUT /api/startups/:id
 * Update a startup idea
 */
const updateStartup = asyncHandler(async (req, res) => {
  let startup = await StartupIdea.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  // Update fields
  const allowedFields = [
    'startupName', 'industry', 'startupStage', 'problemStatement',
    'proposedSolution', 'uniqueSellingProposition', 'targetAudience',
    'revenueModel', 'businessModel', 'competitors', 'budget',
    'teamSize', 'country', 'additionalNotes',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      startup[field] = req.body[field];
    }
  });

  await startup.save();

  res.json({
    success: true,
    message: 'Startup idea updated successfully.',
    startup,
  });
});

/**
 * DELETE /api/startups/:id
 * Delete a startup idea and its associated reports and chat history
 */
const deleteStartup = asyncHandler(async (req, res) => {
  const startup = await StartupIdea.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  // Delete associated data
  await Promise.all([
    ValidationReport.deleteMany({ startup: startup._id }),
    ChatHistory.deleteMany({ startup: startup._id }),
    StartupIdea.findByIdAndDelete(startup._id),
  ]);

  res.json({
    success: true,
    message: 'Startup idea and associated data deleted successfully.',
  });
});

module.exports = { createStartup, getStartups, getStartup, updateStartup, deleteStartup };
