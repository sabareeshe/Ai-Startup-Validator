// ============================================================
// routes/validationRoutes.js — AI Validation Routes
// ============================================================

const express = require('express');
const { createValidation, getValidation, getAllValidations, deleteValidation, downloadPDF } = require('../controllers/validationController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/validations — Get all reports
router.get('/', getAllValidations);

// POST /api/validations/:startupId — Validate a startup
router.post('/:startupId', createValidation);

// GET /api/validations/:startupId/report — Get report for a startup
router.get('/:startupId/report', getValidation);

// GET /api/validations/:id/pdf — Download PDF
router.get('/:id/pdf', downloadPDF);

// DELETE /api/validations/:id — Delete report
router.delete('/:id', deleteValidation);

module.exports = router;
