// Used Copilot to construct basis for code
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  // Multi-Factor Authentication (MFA)
  mfaEnabled: {
    type: Boolean,
    default: false
  },

  mfaSecret: {
    type: String,
    default: null
  },

  // Backup recovery codes for MFA
  backupCodes: [{
    type: String
  }],

  // Songs uploaded by this user
  uploadedSongs: [{
    type: String
  }]
});

module.exports = mongoose.model("User", UserSchema);
