// Used Copilot to construct basis for code
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const homepageRoute = require('./routes/homepage');
const playlistRoute = require('./routes/playlists');
const searchRoute = require('./routes/search');
const mockAuth = require('./middleware/mockAuth');
const auth = require('./middleware/auth');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const mfaRoutes = require('./routes/mfa');
const streamRoutes = require('./routes/stream');

const app = express();

// =========================
// CORS CONFIG
// =========================

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-user-id',
    'x-user-email',
    'x-user-role'
  ]
}));

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

// =========================
// PUBLIC ROUTES
// =========================

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/homepage', homepageRoute);
app.use('/search', searchRoute);

// New authentication endpoints
app.use('/api/auth', authRoutes);
app.use('/api/mfa', mfaRoutes);

// =========================
// PROTECTED ROUTES
// =========================

// Uploads require JWT authentication
app.use('/api/upload', auth, uploadRoutes);

// Streaming routes
app.use('/api', streamRoutes);

// =========================
// MOCK AUTH
// Legacy playlist compatibility
// =========================

app.use(mockAuth);

// =========================
// PLAYLIST ROUTES
// =========================

app.use('/playlists', playlistRoute);
app.use('/api', playlistRoute);

// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect('mongodb://100.84.183.114:27017/tunevault')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// =========================
// START SERVER
// =========================

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
