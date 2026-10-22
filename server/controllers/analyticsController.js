// ============================================================
// controllers/analyticsController.js — Analytics Controller
// ============================================================
// Provides aggregated analytics data for the current user's
// startups and validation reports.
// ============================================================

const StartupIdea = require('../models/StartupIdea');
const ValidationReport = require('../models/ValidationReport');
const { asyncHandler } = require('../utils/helpers');

/**
 * GET /api/analytics
 * Get aggregated analytics for the current user
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Total counts
  const [totalStartups, totalValidations] = await Promise.all([
    StartupIdea.countDocuments({ user: userId }),
    ValidationReport.countDocuments({ user: userId }),
  ]);

  // Average scores
  const scoreAggregation = await ValidationReport.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        avgInnovationScore: { $avg: '$innovationScore' },
        avgMarketScore: { $avg: '$marketPotentialScore' },
        avgScalabilityScore: { $avg: '$scalabilityScore' },
        avgSuccessProbability: { $avg: '$successProbability' },
        avgInvestorReadiness: { $avg: '$investorReadinessScore' },
      },
    },
  ]);

  const avgScores = scoreAggregation[0] || {
    avgInnovationScore: 0,
    avgMarketScore: 0,
    avgScalabilityScore: 0,
    avgSuccessProbability: 0,
    avgInvestorReadiness: 0,
  };

  // Industry distribution
  const industryDistribution = await StartupIdea.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Monthly validations (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyValidations = await ValidationReport.aggregate([
    { $match: { user: userId, createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        avgScore: { $avg: '$innovationScore' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Score distribution
  const scoreDistribution = await ValidationReport.aggregate([
    { $match: { user: userId } },
    {
      $bucket: {
        groupBy: '$innovationScore',
        boundaries: [0, 20, 40, 60, 80, 101],
        default: 'other',
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  // Recent validations
  const recentValidations = await ValidationReport.find({ user: userId })
    .populate('startup', 'startupName industry startupStage')
    .sort({ createdAt: -1 })
    .limit(5);

  // Stage distribution
  const stageDistribution = await StartupIdea.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$startupStage', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    analytics: {
      totalStartups,
      totalValidations,
      avgScores: {
        innovation: Math.round(avgScores.avgInnovationScore || 0),
        market: Math.round(avgScores.avgMarketScore || 0),
        scalability: Math.round(avgScores.avgScalabilityScore || 0),
        successProbability: Math.round(avgScores.avgSuccessProbability || 0),
        investorReadiness: Math.round(avgScores.avgInvestorReadiness || 0),
      },
      industryDistribution: industryDistribution.map((i) => ({
        industry: i._id,
        count: i.count,
      })),
      monthlyValidations: monthlyValidations.map((m) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        count: m.count,
        avgScore: Math.round(m.avgScore),
      })),
      scoreDistribution: scoreDistribution.map((s) => ({
        range: s._id === 'other' ? 'Other' : `${s._id}-${s._id + 19}`,
        count: s.count,
      })),
      stageDistribution: stageDistribution.map((s) => ({
        stage: s._id,
        count: s.count,
      })),
      recentValidations,
    },
  });
});

module.exports = { getAnalytics };
