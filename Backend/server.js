//Used Copilot to construct basis for code
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add API prefix
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
mongoose.connect('mongodb://100.84.183.114:27017/tunevault')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
app.listen(3000, () => console.log("Backend running on port 3000"));
