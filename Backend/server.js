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

// Routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/homepage', homepageRoute);

// MongoDB connection (USE YOUR IP)
mongoose.connect("mongodb://100.84.183.114:27017/tunevault")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});
