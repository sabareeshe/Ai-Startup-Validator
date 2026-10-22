// ============================================================
// routes/adminRoutes.js — Admin Panel Routes
// ============================================================

const express = require('express');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllStartups,
  deleteStartup,
  getAdminAnalytics,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, admin);

// GET /api/admin/users
router.get('/users', getAllUsers);

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', updateUserRole);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// GET /api/admin/startups
router.get('/startups', getAllStartups);

// DELETE /api/admin/startups/:id
router.delete('/startups/:id', deleteStartup);

// GET /api/admin/analytics
router.get('/analytics', getAdminAnalytics);

module.exports = router;
