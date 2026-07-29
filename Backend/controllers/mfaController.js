const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
exports.enableMFA = async (req, res) => {
  const secret = speakeasy.generateSecret({ name: "TuneVault" });
  const qr = await qrcode.toDataURL(secret.otpauth_url);

  // Save secret to user in DB
  user.mfaSecret = secret.base32;
  await user.save();
  res.json({ qr, secret: secret.base32 });
};

exports.verifyMFA = (req, res) => {
  const { token } = req.body;
  const verified = speakeasy.totp.verify({
    secret: req.user.mfaSecret,
    encoding: "base32",
    token
  });

  if (!verified) return res.status(400).json({ message: "Invalid code" });
  res.json({ message: "MFA enabled" });
};
