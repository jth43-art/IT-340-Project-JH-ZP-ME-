const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  // Basic song information
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

  // Uploaded MP3 information
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

  // Optional album artwork
  albumArtworkPath: {
    type: String,
    default: null
  },

  // Optional external music links
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

  // User who uploaded the song
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Optional playlist association
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    default: null
  }

}, {
  // Automatically creates createdAt and updatedAt
  timestamps: true
});

// ==========================================
// SEARCH INDEXES
// ==========================================

// Speeds up direct searches and sorting by title
songSchema.index({ title: 1 });

// Speeds up direct searches and sorting by artist
songSchema.index({ artist: 1 });

// Speeds up direct searches and sorting by album
songSchema.index({ album: 1 });

// Useful if the app commonly searches title + artist together
songSchema.index({ title: 1, artist: 1 });

module.exports = mongoose.model('Song', songSchema);
