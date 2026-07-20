const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/enable', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const secret = speakeasy.generateSecret({
    name: `TuneVault (${user.email})`
  });

  user.mfaSecret = secret.base32;
  user.mfaEnabled = true;
  await user.save();
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qrCode: qr });
});

router.post('/verify', async (req, res) => {
  const { userId, code } = req.body;

  const user = await User.findById(userId);
  if (!user || !user.mfaEnabled)
    return res.status(400).json({ message: 'MFA not enabled' });
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code,
    window: 1
  });

  if (!verified)
    return res.status(401).json({ message: 'Invalid MFA code' });
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, mfaVerified: true },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

router.post('/disable', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.mfaEnabled = false;
  user.mfaSecret = null;
  await user.save();
  res.json({ message: 'MFA disabled' });
});
module.exports = router;
