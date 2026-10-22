// ============================================================
// controllers/validationController.js — AI Validation Controller
// ============================================================
// Handles startup validation via Gemini AI, report retrieval,
// revalidation, and PDF download.
// ============================================================

const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const ApiError = require('../utils/apiError');
const { asyncHandler } = require('../utils/helpers');
const { validateStartup } = require('../services/geminiService');
const { generateReportPDF } = require('../services/pdfService');

/**
 * POST /api/validations/:startupId
 * Validate a startup idea using Gemini AI and save the report
 */
const createValidation = asyncHandler(async (req, res) => {
  const startup = await StartupIdea.findOne({
    _id: req.params.startupId,
    user: req.user._id,
  });

  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  // Call Gemini AI for validation
  const aiResult = await validateStartup(startup.toObject());

  // Delete any existing report for this startup (revalidation)
  await ValidationReport.deleteMany({ startup: startup._id });

  // Create new validation report
  const report = await ValidationReport.create({
    startup: startup._id,
    user: req.user._id,
    ...aiResult,
  });

  // Mark startup as validated
  startup.isValidated = true;
  await startup.save();

  res.status(201).json({
    success: true,
    message: 'Startup validated successfully.',
    report,
  });
});

/**
 * GET /api/validations/:startupId
 * Get the validation report for a specific startup
 */
const getValidation = asyncHandler(async (req, res) => {
  const report = await ValidationReport.findOne({
    startup: req.params.startupId,
    user: req.user._id,
  }).populate('startup', 'startupName industry startupStage');

  if (!report) {
    throw new ApiError('Validation report not found.', 404);
  }

  res.json({ success: true, report });
});

/**
 * GET /api/validations
 * Get all validation reports for the current user
 */
const getAllValidations = asyncHandler(async (req, res) => {
  const { search, industry, minScore, maxScore, sortBy, order, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };

  // Filter by score range
  if (minScore) query.innovationScore = { ...query.innovationScore, $gte: parseInt(minScore) };
  if (maxScore) query.innovationScore = { ...query.innovationScore, $lte: parseInt(maxScore) };

  // Sort
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let [reports, total] = await Promise.all([
    ValidationReport.find(query)
      .populate('startup', 'startupName industry startupStage')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    ValidationReport.countDocuments(query),
  ]);

  // Post-query filter by industry and search (via populated field)
  if (industry || search) {
    reports = reports.filter((r) => {
      if (!r.startup) return false;
      if (industry && !r.startup.industry.toLowerCase().includes(industry.toLowerCase())) return false;
      if (search && !r.startup.startupName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  res.json({
    success: true,
    reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * DELETE /api/validations/:id
 * Delete a validation report
 */
const deleteValidation = asyncHandler(async (req, res) => {
  const report = await ValidationReport.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!report) {
    throw new ApiError('Validation report not found.', 404);
  }

  // Mark startup as not validated
  await StartupIdea.findByIdAndUpdate(report.startup, { isValidated: false });
  await ValidationReport.findByIdAndDelete(report._id);

  res.json({
    success: true,
    message: 'Validation report deleted successfully.',
  });
});

/**
 * GET /api/validations/:id/pdf
 * Download validation report as PDF
 */
const downloadPDF = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  // Non-admins can only download their own reports
  if (req.user.role !== 'admin') {
    query.user = req.user._id;
  }

  const report = await ValidationReport.findOne(query).populate('startup');

  if (!report) {
    throw new ApiError('Validation report not found.', 404);
  }

  const startupObj = report.startup || { startupName: 'Startup', industry: 'General', startupStage: 'Idea' };
  const safeName = (startupObj.startupName || 'Startup').replace(/[^a-z0-9]/gi, '_');
  const filename = `${safeName}_Validation_Report.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Generate and pipe PDF to response
  const doc = generateReportPDF(report, startupObj);
  doc.pipe(res);
});

module.exports = { createValidation, getValidation, getAllValidations, deleteValidation, downloadPDF };
