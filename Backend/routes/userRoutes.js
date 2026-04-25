const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.json({ success: false, message: "Email already exists" });
        const user = new User({ email, password });
        await user.save();
        res.json({ success: true, message: "User registered", user });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });
    res.json({
        success: true,
        message: "Login successful",
        user
    });
});

module.exports = router;
