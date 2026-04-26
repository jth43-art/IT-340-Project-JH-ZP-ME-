//Used Copilot to construct basis for code
const bcrypt = require("bcrypt");
const User = require("../models/User");
const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password, termsAccepted } = req.body;

      // Basic validation
    if (!fullName || !email || !username || !password || !termsAccepted) {
      return res.status(400).json({ message: "All fields are required" });
    }

      // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with ALL fields
    const newUser = new User({
      fullName,
      email,
      username,
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
