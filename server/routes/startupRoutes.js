// ============================================================
// routes/startupRoutes.js — Startup CRUD Routes
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const { createStartup, getStartups, getStartup, updateStartup, deleteStartup } = require('../controllers/startupController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Validation rules for creating/updating startups
const startupValidation = [
  body('startupName').trim().notEmpty().withMessage('Startup name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('startupStage').isIn(['Idea', 'MVP', 'Early Stage', 'Growth', 'Scale', 'Mature']).withMessage('Valid startup stage is required'),
  body('problemStatement').trim().notEmpty().withMessage('Problem statement is required'),
  body('proposedSolution').trim().notEmpty().withMessage('Proposed solution is required'),
  body('uniqueSellingProposition').trim().notEmpty().withMessage('USP is required'),
  body('targetAudience').trim().notEmpty().withMessage('Target audience is required'),
  body('revenueModel').trim().notEmpty().withMessage('Revenue model is required'),
  body('businessModel').trim().notEmpty().withMessage('Business model is required'),
  body('budget').trim().notEmpty().withMessage('Budget is required'),
  body('teamSize').trim().notEmpty().withMessage('Team size is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
];

// POST /api/startups
router.post('/', startupValidation, validate, createStartup);

// GET /api/startups
router.get('/', getStartups);

// GET /api/startups/:id
router.get('/:id', getStartup);

// PUT /api/startups/:id
router.put('/:id', updateStartup);

// DELETE /api/startups/:id
router.delete('/:id', deleteStartup);

module.exports = router;
