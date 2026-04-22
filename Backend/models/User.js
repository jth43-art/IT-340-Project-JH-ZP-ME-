//Used Copilot to construct basis for code
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "user" }
});
module.exports = mongoose.model("User", userSchema);
