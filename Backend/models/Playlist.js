// Playlist model for TuneVault
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  artist: { type: String, required: true },
  album: { type: String },
  image: { type: String },
  source: { type: String, enum: ["api", "upload"], default: "api" },
  url: { type: String },
  filePath: {type: String }
  filePath: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    songs: [songSchema],
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
