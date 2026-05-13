// Playlist model for TuneVault
const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  album: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: ""
  },

  artworkUrl: {
    type: String,
    default: ""
  },

  source: {
    type: String,
    enum: ["api", "upload", "local"],
    default: "api"
  },

  url: {
    type: String,
    default: ""
  },

  previewUrl: {
    type: String,
    default: ""
  },

  filePath: {
    type: String,
    default: ""
  },

  localFile: {
    type: String,
    default: ""
  },

  externalLinks: {
    spotify: {
      type: String,
      default: ""
    },
    appleMusic: {
      type: String,
      default: ""
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    songs: [songSchema],

    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Playlist", playlistSchema);
