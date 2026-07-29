// Used Copilot to construct basis for code
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String, default: null },
  uploadedSongs: [{ type: String }]
});

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },

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
  }
});

module.exports = mongoose.model("User", UserSchema);
