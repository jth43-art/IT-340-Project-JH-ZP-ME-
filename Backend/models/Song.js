const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  // Basic song information
  title: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    default: ''
  },

  album: {
    type: String,
    default: ''
  },

  genre: {
    type: String,
    default: ''
  },

  duration: {
    type: Number,
    default: null
  },

  // Uploaded MP3 information
  filePath: {
    type: String,
    default: null
  },

  fileSize: {
    type: Number,
    default: null
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

module.exports = mongoose.model('Song', songSchema);
