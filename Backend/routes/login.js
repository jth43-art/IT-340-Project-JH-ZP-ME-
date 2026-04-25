//Used Copilot to construct basis for code
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/registerController");
router.post("/", registerUser);
module.exports = router;
