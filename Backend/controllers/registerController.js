//Used Copilot to construct basis for code
const User = require("../models/User");
const bcrypt = require("bcrypt");
function sanitize(input) {
    if (typeof input !== "string") return ""; return input.replace(/[$.]/g, ""); // Prevent NoSQL operator injection
}
exports.registerUser = async (req, res) => {
    try {
        let { fullName, email, username, password, termsAccepted } = req.body;
        fullName = sanitize(fullName);
        email = sanitize(email);
        username = sanitize(username);
        password = sanitize(password);
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!termsAccepted) {
            return res.status(400).json({ message: "You must accept the Terms of Service" });
        }
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        }).lean();
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
