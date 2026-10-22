// ============================================================
// controllers/authController.js — Authentication Controller
// ============================================================
// Handles user registration, login, forgot password, reset
// password, and current user retrieval.
// ============================================================

const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { asyncHandler, generateToken } = require('../utils/helpers');
const { sendResetEmail } = require('../services/emailService');
const crypto = require('crypto');

/**
 * POST /api/auth/register
 * Register a new user account
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('An account with this email already exists.', 400);
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate JWT
  const token = user.generateToken();

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field included
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError('Invalid email or password.', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password.', 401);
  }

  // Generate JWT
  const token = user.generateToken();

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

/**
 * POST /api/auth/forgot-password
 * Generate reset token and send email
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether the email exists
    return res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  }

  // Generate reset token
  const resetToken = generateToken();
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // Send email
  try {
    await sendResetEmail(user.email, resetToken);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError('Error sending reset email. Please try again.', 500);
  }

  res.json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent.',
  });
});

/**
 * POST /api/auth/reset-password/:token
 * Reset password using token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError('Invalid or expired reset token.', 400);
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Generate new JWT
  const token = user.generateToken();

  res.json({
    success: true,
    message: 'Password reset successful.',
    token,
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = { register, login, forgotPassword, resetPassword, getMe };
