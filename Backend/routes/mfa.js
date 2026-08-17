const express = require("express");
const router = express.Router();

const mfaController =
  require("../controllers/mfaController");

const auth =
  require("../middleware/auth");


// ==========================================
// LOGIN MFA VERIFICATION
// No normal JWT yet because the user
// has not completed login.
// ==========================================

router.post(
  "/login/verify",
  mfaController.verifyLoginMFA
);


// ==========================================
// MFA SETUP / MANAGEMENT
// Requires authenticated user
// ==========================================

router.post(
  "/enable",
  auth,
  mfaController.enableMFA
);

router.post(
  "/verify",
  auth,
  mfaController.verifyMFA
);

router.post(
  "/disable",
  auth,
  mfaController.disableMFA
);


module.exports = router;
