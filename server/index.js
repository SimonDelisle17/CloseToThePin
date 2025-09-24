const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Custom Morgan format for FastAPI-like logging
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Custom Morgan format similar to FastAPI
const logFormat = ':timestamp :method :url :status :response-time ms';

// Response time tracking
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan(logFormat));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/closetothepin')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Close to the Pin API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🏌️‍♂️ Close to the Pin API Server');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Server accessible via http://0.0.0.0:${PORT} (all interfaces)`);
  console.log(`📱 For Android emulator: http://10.0.2.2:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/closetothepin'}`);
  console.log('📋 Available endpoints:');
  console.log('   GET  /               - API status');
  console.log('   GET  /health         - Health check');
  console.log('   POST /api/auth/login - User login');
  console.log('   POST /api/auth/register - User registration');
  console.log('   GET  /api/auth/profile - User profile');
  console.log('\n🔍 API request logging enabled (FastAPI-style)\n');
});