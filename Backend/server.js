//Used Copilot to construct basis for code
// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const homepageRoute = require('./routes/homepage');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  // Example user object; replace with real auth
  // req.user = { _id: '663a1f2c1234567890abcd12', role: 'user', email: 'test@example.com' };
  next();
});

// Routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/homepage', homepageRoute);
app.use('/api/playlists', playlistRoutes);
// If you want /api/search instead of /api/playlists/search,
// you can also mount the same router at /api:
app.use('/api', playlistRoutes);

// MongoDB connection (USE YOUR IP)
mongoose.connect("mongodb://100.84.183.114:27017/tunevault")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});
