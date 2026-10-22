// ============================================================
// middleware/validate.js — Express Validator Middleware
// ============================================================
// Checks express-validator results and returns errors if any
// validation rules failed.
// ============================================================

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validate;
