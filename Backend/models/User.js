//Used Copilot to construct basis for code
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    termsAccepted: { type: Boolean, required: true }
});
module.exports = mongoose.model("User", UserSchema);
