// Used Copilot to construct basis for code
const bcrypt = require("bcrypt");
const User = require("../models/User");

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body || {};

    // Prevent NoSQL injection by making sure inputs are strings
    if (
      typeof identifier !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Basic validation
    if (!cleanIdentifier || !cleanPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };
