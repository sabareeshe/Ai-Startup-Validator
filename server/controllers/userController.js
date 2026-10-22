// ============================================================
// controllers/userController.js — User Profile Controller
// ============================================================
// Handles user profile viewing, updating, and password changes.
// ============================================================

const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { asyncHandler } = require('../utils/helpers');

/**
 * GET /api/users/profile
 * Get current user's profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

/**
 * PUT /api/users/profile
 * Update user profile (name, email, avatar)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) {
    // Check if email is taken by another user
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) {
      throw new ApiError('Email is already in use by another account.', 400);
    }
    updates.email = email;
  }
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'Profile updated successfully.',
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
 * PUT /api/users/change-password
 * Change the current user's password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect.', 400);
  }

  // Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  // Generate new token since password changed
  const token = user.generateToken();

  res.json({
    success: true,
    message: 'Password changed successfully.',
    token,
  });
});

module.exports = { getProfile, updateProfile, changePassword };
