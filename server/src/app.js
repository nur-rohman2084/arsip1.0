const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const turretsRoutes = require('./routes/turrets');
const studentsRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teacher');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static route for avatar assets
const avatarAssetsPath = path.join(__dirname, '../../avatar-assets');
app.use('/avatar-assets', express.static(avatarAssetsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Archive Academy API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/turrets', turretsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teacher', teacherRoutes);

// Serve built frontend if client/dist exists
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/avatar-assets')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
