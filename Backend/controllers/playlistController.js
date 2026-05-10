const Playlist = require('../models/Playlist');
const mongoose = require('mongoose');
const axios = require('axios');
function canModify(playlist, user) {
  if (!user) return false;
  const owner = playlist.owner?.toString() === user._id.toString();
  const admin = user.role === 'admin';
  return owner || admin;
}

// CREATE PLAYLIST
exports.createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      name: req.body.name,
      description: req.body.description || '',
      songs: req.body.songs || [],
      isPublic: req.body.isPublic || false,
      owner: req.user._id
    });

    res.status(201).json({ playlist });
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ message: 'Error creating playlist' });
  }
};

// GET PLAYLISTS
exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      $or: [
        { owner: req.user._id },
        { isPublic: true }
      ]
    });

    res.json({ playlists });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Error fetching playlists' });
  }
};

// UPDATE PLAYLIST
exports.updatePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID' });

  const playlist = await Playlist.findById(id);
  if (!playlist)
    return res.status(404).json({ message: 'Not found' });

  if (!canModify(playlist, req.user))
    return res.status(403).json({ message: 'Forbidden' });

  Object.assign(playlist, req.body);
  await playlist.save();

  res.json({ playlist });
};

// DELETE PLAYLIST
exports.deletePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID' });

  const playlist = await Playlist.findById(id);
  if (!playlist)
    return res.status(404).json({ message: 'Not found' });

  if (!canModify(playlist, req.user))
    return res.status(403).json({ message: 'Forbidden' });

  await playlist.deleteOne();
  res.json({ message: 'Deleted' });
};

// MUSIC SEARCH API
// GET /api/search?query=
exports.searchMusic = async (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ message: 'Search query required' });
  }

  try {
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'music',
        limit: 15
      }
    });

    const results = (response.data.results || []).map(item => {
      const artist = item.artistName;
      const track = item.trackName || query;
      const encoded = encodeURIComponent(`${artist} ${track}`);
      return {
        artist,
        track,
        album: item.collectionName,
        previewUrl: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        externalLinks: {
          spotify: `https://open.spotify.com/search/${encoded}`,
          appleMusic: `https://music.apple.com/us/search?term=${encoded}`
        }
      };
    });

    res.json({
      query,
      count: results.length,
      results
    });

  } catch (err) {
    console.error('Music API error:', err);
    res.status(502).json({ message: 'Music API error' });
  }
};
