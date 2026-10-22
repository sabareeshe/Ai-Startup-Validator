// ============================================================
// routes/authRoutes.js — Authentication Routes
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

// POST /api/auth/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], validate, forgotPassword);

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

// GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;
