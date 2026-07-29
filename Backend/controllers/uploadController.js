const path = require("path");
const User = require("../models/User");

exports.uploadSong = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const filename = req.file.filename;
    const user = await User.findById(req.user._id);
    if (user) {
      user.uploadedSongs.push(filename);
      await user.save();
    }
    res.json({
      message: "Upload successful", file: filename, url: `/songs/${filename}/stream`});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
