//Used Copilot to construct basis for code
const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        // identifier = username OR email
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        return res.status(200).json({
            message: "Login successful",
            user: {username: user.username, email: user.email}
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
