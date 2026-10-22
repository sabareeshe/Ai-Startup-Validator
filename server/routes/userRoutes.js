// ============================================================
// routes/userRoutes.js — User Profile Routes
// ============================================================

const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
], validate, updateProfile);

// PUT /api/users/change-password
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], validate, changePassword);

module.exports = router;
