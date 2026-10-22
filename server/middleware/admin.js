// ============================================================
// middleware/admin.js — Admin Role Authorization
// ============================================================
// Checks that the authenticated user has admin privileges.
// Must be used AFTER the auth middleware.
// ============================================================

const ApiError = require('../utils/apiError');

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError('Access denied. Admin privileges required.', 403));
};

module.exports = admin;
