// Used Copilot to construct basis for code
const bcrypt = require("bcrypt");
const User = require("../models/User");
const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password, termsAccepted } = req.body || {};

    // Prevent NoSQL injection by making sure inputs are strings
    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Basic validation
    if (!fullName || !email || !username || !password || !termsAccepted) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with ALL fields
    const newUser = new User({
      fullName: cleanFullName,
      email: cleanEmail,
      username: cleanUsername,
      password: hashedPassword,
      createdAt: new Date(),
      role: "user"
    });

    await newUser.save();
    res.status(201).json({
      message: "Registration successful",
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { registerUser };
