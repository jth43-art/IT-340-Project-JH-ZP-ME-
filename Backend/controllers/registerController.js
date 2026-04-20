//Used Copilot to construct basis for code
const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, username, password, termsAccepted } = req.body;
        // Validate required fields
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!termsAccepted) {
            return res.status(400).json({ message: "You must accept the Terms of Service" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword,
            termsAccepted
        });
        await newUser.save();
        return res.status(201).json({
            message: "Registration successful",
            user: {
                fullName: newUser.fullName,
                email: newUser.email,
                username: newUser.username
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
