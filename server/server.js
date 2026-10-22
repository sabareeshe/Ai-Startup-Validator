// ============================================================
// server.js — Express Application Entry Point
// ============================================================
// Initializes Express with security middleware, connects to
// MongoDB, mounts all API routes, and starts the HTTP server.
// ============================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const startupRoutes = require('./routes/startupRoutes');
const validationRoutes = require('./routes/validationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --------------- Security Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// --------------- Body Parsing ---------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --------------- Static Files ---------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- API Routes ---------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/validations', validationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// --------------- Health Check ---------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Global Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
});
