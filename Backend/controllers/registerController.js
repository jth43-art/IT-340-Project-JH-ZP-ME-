//Used Copilot to construct basis for code
const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({$or: [{ username }, { email }]});
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({
            message: "Registration successful",
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
