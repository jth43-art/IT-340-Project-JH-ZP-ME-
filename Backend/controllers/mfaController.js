const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==========================================
// ENABLE MFA / GENERATE QR CODE
// POST /api/mfa/enable
// Requires normal JWT
// ==========================================

exports.enableMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const secret = speakeasy.generateSecret({
      name: `TuneVault (${user.email})`
    });

    // Store secret but do NOT enable MFA yet.
    // User must first prove that Google Authenticator works.
    user.mfaSecret = secret.base32;
    user.mfaEnabled = false;

    await user.save();

    const qrDataUrl = await qrcode.toDataURL(
      secret.otpauth_url
    );

    return res.status(200).json({
      message: "Scan the QR code with your authenticator app",
      qrCode: qrDataUrl,
      secret: secret.base32
    });

  } catch (err) {
    console.error("Enable MFA error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// VERIFY INITIAL MFA SETUP
// POST /api/mfa/verify
// Requires normal JWT
// ==========================================

exports.verifyMFA = async (req, res) => {
  try {
    const { token } = req.body || {};

    if (typeof token !== "string" || !token.trim()) {
      return res.status(400).json({
        message: "MFA code is required"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.mfaSecret) {
      return res.status(400).json({
        message: "MFA not initialized"
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: token.trim(),
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        message: "Invalid MFA code"
      });
    }

    user.mfaEnabled = true;

    await user.save();

    return res.status(200).json({
      message: "MFA enabled successfully"
    });

  } catch (err) {
    console.error("Verify MFA error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// VERIFY MFA DURING LOGIN
// POST /api/mfa/login/verify
// DOES NOT require normal JWT
// Uses the temporary MFA token instead
// ==========================================

exports.verifyLoginMFA = async (req, res) => {
  try {
    const {
      tempToken,
      token
    } = req.body || {};

    if (
      typeof tempToken !== "string" ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        message: "Temporary token and MFA code are required"
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        tempToken,
        process.env.JWT_SECRET
      );
    } catch (err) {
      return res.status(401).json({
        message: "MFA session expired or invalid"
      });
    }

    // Make sure this token was specifically created
    // for an MFA login challenge.
    if (decoded.purpose !== "mfa-login") {
      return res.status(401).json({
        message: "Invalid MFA session"
      });
    }

    const user = await User.findById(decoded._id);

    if (
      !user ||
      !user.mfaEnabled ||
      !user.mfaSecret
    ) {
      return res.status(400).json({
        message: "MFA is not enabled for this user"
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: token.trim(),
      window: 1
    });

    if (!verified) {
      return res.status(400).json({
        message: "Invalid MFA code"
      });
    }

    // MFA passed.
    // NOW issue the real authentication JWT.
    const authToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      message: "MFA verified. Login successful.",

      token: authToken,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        mfaEnabled: user.mfaEnabled
      }
    });

  } catch (err) {
    console.error("MFA login verification error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// DISABLE MFA
// POST /api/mfa/disable
// Requires normal JWT
// ==========================================

exports.disableMFA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.backupCodes = [];

    await user.save();

    return res.status(200).json({
      message: "MFA disabled successfully"
    });

  } catch (err) {
    console.error("Disable MFA error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
