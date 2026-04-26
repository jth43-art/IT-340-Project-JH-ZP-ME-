// Used Copilot to construct basis for code
const bcrypt = require("bcrypt");
const User = require("../models/User");
const loginUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
