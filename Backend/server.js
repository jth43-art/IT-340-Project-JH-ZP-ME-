// Used Copilot to construct basis for code

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const homepageRoute = require('./routes/homepage');
const playlistRoute = require('./routes/playlists');
const searchRoute = require('./routes/search');
const mockAuth = require('./middleware/mockAuth');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/homepage', homepageRoute);
app.use('/search', searchRoute);
app.use('/api/upload', uploadRoutes);

// Mock auth must come BEFORE protected playlist routes
app.use(mockAuth);

// Protected playlist routes
app.use('/playlists', playlistRoute);
app.use('/api', playlistRoute);

// MongoDB connection
mongoose.connect('mongodb://100.84.183.114:27017/tunevault')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
