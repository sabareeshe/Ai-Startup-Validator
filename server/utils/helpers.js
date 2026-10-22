// ============================================================
// utils/helpers.js — Utility Functions
// ============================================================

/**
 * Wrap async route handlers to automatically catch errors
 * and forward them to the Express error handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Generate a random token string for password resets.
 */
const generateToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { asyncHandler, generateToken };
