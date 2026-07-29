const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/User");

exports.enableMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const secret = speakeasy.generateSecret({ name: "TuneVault" });
    user.mfaSecret = secret.base32;
    user.mfaEnabled = false; // only true after verification
    await user.save();
    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.json({
      qrCode: qrDataUrl, secret: secret.base32});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyMFA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !user.mfaSecret)
      return res.status(400).json({ message: "MFA not initialized" });
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret, encoding: "base32", token, window: 1});
    if (!verified) return res.status(400).json({ message: "Invalid code" });
    user.mfaEnabled = true;
    await user.save();
    res.json({ message: "MFA enabled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.disableMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.mfaEnabled = false;
    user.mfaSecret = null;
    await user.save();
    res.json({ message: "MFA disabled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
