// ============================================================
// controllers/adminController.js — Admin Panel Controller
// ============================================================
// Provides admin-level access to all users, startups,
// analytics, and moderation capabilities.
// ============================================================

const User = require('../models/User');
const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const ChatHistory = require('../models/ChatHistory');
const ApiError = require('../utils/apiError');
const { asyncHandler } = require('../utils/helpers');

/**
 * GET /api/admin/users
 * List all users (admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  // Get startup counts for each user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const startupCount = await StartupIdea.countDocuments({ user: user._id });
      const validationCount = await ValidationReport.countDocuments({ user: user._id });
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        startupCount,
        validationCount,
      };
    })
  );

  res.json({
    success: true,
    users: usersWithStats,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

/**
 * GET /api/admin/startups
 * List all startups across all users (admin only)
 */
const getAllStartups = asyncHandler(async (req, res) => {
  const { search, industry, page = 1, limit = 20 } = req.query;
  const query = {};

  if (search) {
    query.startupName = { $regex: search, $options: 'i' };
  }
  if (industry) {
    query.industry = { $regex: industry, $options: 'i' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [startups, total] = await Promise.all([
    StartupIdea.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    StartupIdea.countDocuments(query),
  ]);

  res.json({
    success: true,
    startups,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
  });
});

/**
 * DELETE /api/admin/startups/:id
 * Delete any startup (admin only)
 */
const deleteStartup = asyncHandler(async (req, res) => {
  const startup = await StartupIdea.findById(req.params.id);
  if (!startup) {
    throw new ApiError('Startup idea not found.', 404);
  }

  await Promise.all([
    ValidationReport.deleteMany({ startup: startup._id }),
    ChatHistory.deleteMany({ startup: startup._id }),
    StartupIdea.findByIdAndDelete(startup._id),
  ]);

  res.json({
    success: true,
    message: 'Startup and associated data deleted by admin.',
  });
});

/**
 * GET /api/admin/analytics
 * Platform-wide analytics (admin only)
 */
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalStartups, totalValidations] = await Promise.all([
    User.countDocuments(),
    StartupIdea.countDocuments(),
    ValidationReport.countDocuments(),
  ]);

  // Most popular industries
  const popularIndustries = await StartupIdea.aggregate([
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Average scores platform-wide
  const avgScores = await ValidationReport.aggregate([
    {
      $group: {
        _id: null,
        avgInnovation: { $avg: '$innovationScore' },
        avgMarket: { $avg: '$marketPotentialScore' },
        avgSuccess: { $avg: '$successProbability' },
      },
    },
  ]);

  // Recent signups
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email createdAt');

  // Monthly user growth
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalStartups,
      totalValidations,
      popularIndustries: popularIndustries.map((i) => ({ industry: i._id, count: i.count })),
      avgScores: avgScores[0] || { avgInnovation: 0, avgMarket: 0, avgSuccess: 0 },
      recentUsers,
      userGrowth: userGrowth.map((u) => ({
        month: `${u._id.year}-${String(u._id.month).padStart(2, '0')}`,
        count: u.count,
      })),
    },
  });
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role (admin only)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    throw new ApiError('Invalid role. Must be user or admin.', 400);
  }

  // Prevent admin from removing their own admin status
  if (req.params.id === req.user._id.toString() && role !== 'admin') {
    throw new ApiError('You cannot revoke your own admin role.', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new ApiError('User not found.', 404);
  }

  res.json({
    success: true,
    message: `User role updated to ${role}.`,
    user,
  });
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user and all their associated data (admin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError('You cannot delete your own admin account.', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError('User not found.', 404);
  }

  // Find all startups by this user
  const startups = await StartupIdea.find({ user: user._id }).select('_id');
  const startupIds = startups.map((s) => s._id);

  // Clean up all data
  await Promise.all([
    ValidationReport.deleteMany({ $or: [{ user: user._id }, { startup: { $in: startupIds } }] }),
    ChatHistory.deleteMany({ $or: [{ user: user._id }, { startup: { $in: startupIds } }] }),
    StartupIdea.deleteMany({ user: user._id }),
    User.findByIdAndDelete(user._id),
  ]);

  res.json({
    success: true,
    message: 'User and all associated data deleted successfully.',
  });
});

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllStartups,
  deleteStartup,
  getAdminAnalytics,
};
