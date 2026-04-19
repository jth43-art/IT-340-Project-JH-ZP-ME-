//Used Copilot to construct basis for code
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true } // hashed
});

module.exports = mongoose.model("User", UserSchema);
