const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC SONG INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true
    },

    artist: {
      type: String,
      default: '',
      trim: true
    },

    album: {
      type: String,
      default: '',
      trim: true
    },

    genre: {
      type: String,
      default: '',
      trim: true
    },

    duration: {
      type: Number,
      default: null,
      min: 0
    },

    // ==========================================
    // UPLOADED MP3 INFORMATION
    // ==========================================

    filePath: {
      type: String,
      default: null
    },

    fileSize: {
      type: Number,
      default: null,
      min: 0
    },

    mimeType: {
      type: String,
      default: 'audio/mpeg'
    },

    // ==========================================
    // OPTIONAL ALBUM ARTWORK
    // ==========================================

    albumArtworkPath: {
      type: String,
      default: null
    },

    // ==========================================
    // OPTIONAL EXTERNAL MUSIC LINKS
    // ==========================================

    externalLinks: {
      spotify: {
        type: String,
        default: null
      },

      appleMusic: {
        type: String,
        default: null
      }
    },

    // ==========================================
    // USER WHO UPLOADED THE SONG
    // ==========================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // ==========================================
    // OPTIONAL PLAYLIST ASSOCIATION
    // ==========================================

    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Playlist',
      default: null
    }
  },
  {
    // Automatically creates:
    // createdAt
    // updatedAt
    timestamps: true
  }
);

// ==========================================
// SEARCH INDEXES
// ==========================================

// Speeds up title-based searches and sorting.
songSchema.index({
  title: 1
});

// Speeds up artist-based searches and sorting.
songSchema.index({
  artist: 1
});

// Speeds up album-based searches and sorting.
songSchema.index({
  album: 1
});

// Useful when title and artist are searched together.
songSchema.index({
  title: 1,
  artist: 1
});

// ==========================================
// MUSIC LIBRARY INDEX
// ==========================================

// Optimized for:
//
// Song.find({ owner: req.user._id })
//   .sort({ createdAt: -1 })
//
// This allows TuneVault to quickly retrieve a user's
// uploaded songs with newest uploads first.
songSchema.index({
  owner: 1,
  createdAt: -1
});

// ==========================================
// MODEL EXPORT
// ==========================================

module.exports = mongoose.model(
  'Song',
  songSchema
);
