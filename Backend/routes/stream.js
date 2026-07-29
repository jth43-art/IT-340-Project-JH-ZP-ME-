const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");
const auth = require("../middleware/auth");
router.get("/songs/:id/stream", auth, streamController.streamSong);

module.exports = router;
