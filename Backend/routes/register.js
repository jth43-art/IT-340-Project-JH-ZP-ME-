//Used Copilot to construct basis for code
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {registerUser} = require("../controllers/registerController");
const router = express.Router();
router.post("/", registerUser);
module.exports = router;
