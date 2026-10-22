// ============================================================
// middleware/auth.js — JWT Authentication Middleware
// ============================================================
// Extracts and verifies JWT from the Authorization header,
// then attaches the user to the request object.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header or query parameter
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      throw new ApiError('Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError('User not found. Token may be invalid.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired. Please login again.', 401));
    }
    next(error);
  }
};

module.exports = auth;
