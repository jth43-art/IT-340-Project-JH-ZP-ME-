const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: '' },
  album: { type: String, default: '' },
  filePath: { type: String, default: null },
  fileSize: { type: Number, default: null },
  mimeType: { type: String, default: 'audio/mpeg' },
  externalLinks: {
    spotify: { type: String, default: null },
    appleMusic: { type: String, default: null }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', default: null },
}, { timestamps: true });
module.exports = mongoose.model('Song', songSchema);
