const log = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Used Copilot to construct basis for code

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};

    log(`LOGIN attempt: ${identifier}`);

    if (
      typeof identifier !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input"
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
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
      log(`LOGIN failed: ${cleanIdentifier}`);

      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      cleanPassword,
      user.password
    );

    if (!isMatch) {
      log(`LOGIN failed: ${cleanIdentifier}`);

      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    log(`LOGIN success: ${cleanIdentifier}`);

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
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

module.exports = {
  loginUser
};
