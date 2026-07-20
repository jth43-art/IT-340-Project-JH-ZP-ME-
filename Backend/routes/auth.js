const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, mfaVerified: !user.mfaEnabled },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
});
module.exports = router;
