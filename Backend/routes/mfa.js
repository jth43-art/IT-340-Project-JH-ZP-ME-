const express = require("express");
const router = express.Router();
const mfaController = require("../controllers/mfaController");
const auth = require("../middleware/auth");

router.post("/enable", auth, mfaController.enableMFA);
router.post("/verify", auth, mfaController.verifyMFA);
router.post("/disable", auth, mfaController.disableMFA);

module.exports = router;
