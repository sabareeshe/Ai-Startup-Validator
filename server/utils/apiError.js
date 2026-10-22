// ============================================================
// utils/apiError.js — Custom API Error Class
// ============================================================
// Extends Error with HTTP status codes for consistent error
// handling across the application.
// ============================================================

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
