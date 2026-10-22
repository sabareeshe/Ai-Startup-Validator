// ============================================================
// routes/analyticsRoutes.js — Analytics Routes
// ============================================================

const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics
router.get('/', auth, getAnalytics);

module.exports = router;
