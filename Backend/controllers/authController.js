const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

exports.register = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body || {};

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input"
      });
    }

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (
      !cleanFullName ||
      !cleanEmail ||
      !cleanUsername ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existing = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername }
      ]
    });

    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: cleanFullName,
      email: cleanEmail,
      username: cleanUsername,
      password: hash,
      role: "user"
    });

    return res.status(201).json({
      message: "Registered successfully",
      userId: user._id
    });

  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

exports.login = async (req, res) => {
  try {
    const {
      identifier,
      email,
      username,
      password
    } = req.body || {};

    const loginIdentifier =
      identifier ||
      email ||
      username;

    if (
      typeof loginIdentifier !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input"
      });
    }

    const cleanIdentifier =
      loginIdentifier.trim().toLowerCase();

    if (!cleanIdentifier || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier }
      ]
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // ======================================
    // MFA REQUIRED
    // ======================================

    if (user.mfaEnabled) {

      // Temporary token only allows MFA login verification.
      // It is NOT the user's authenticated session token.
      const tempToken = jwt.sign(
        {
          _id: user._id,
          purpose: "mfa-login"
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m"
        }
      );

      return res.status(403).json({
        message: "MFA required",
        mfaRequired: true,
        tempToken
      });
    }

    // ======================================
    // MFA NOT ENABLED - NORMAL LOGIN
    // ======================================

    const token = jwt.sign(
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
      message: "Login successful",
      token,

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
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
