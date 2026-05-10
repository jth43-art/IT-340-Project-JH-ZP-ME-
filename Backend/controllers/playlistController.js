// controllers/playlistController.js
const axios = require('axios');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist'); // adjust path if needed

// Helper: check if current user can modify a playlist
function canModifyPlaylist(playlist, user) {
  if (!user) return false;
  const isOwner =
    playlist.owner &&
    playlist.owner.toString() === user._id.toString();
  const isAdmin = user.role === 'admin';
  return isOwner || isAdmin;
}

// 1. CREATE PLAYLIST
// POST /api/playlists
exports.createPlaylist = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, description, songs, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({
      name,
      description: description || '',
      songs: songs || [],
      isPublic: !!isPublic,
      owner: req.user._id,
    });

    return res.status(201).json({
      message: 'Playlist created successfully',
      playlist,
    });
  } catch (err) {
    console.error('Error creating playlist:', err);
    return res.status(500).json({ message: 'Server error creating playlist' });
  }
};

// 2. GET PLAYLISTS
// GET /api/playlists
exports.getPlaylists = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Example: return playlists owned by user OR public playlists
    const playlists = await Playlist.find({
      $or: [{ owner: req.user._id }, { isPublic: true }],
    }).populate('owner', 'username email');
    return res.status(200).json({ playlists });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    return res.status(500).json({ message: 'Server error fetching playlists' });
  }
};

// 3. EDIT PLAYLIST
// PUT /api/playlists/:id
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (!canModifyPlaylist(playlist, req.user)) {
      return res.status(403).json({ message: 'Not allowed to modify this playlist' });
    }

    const { name, description, songs, isPublic } = req.body;
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (songs !== undefined) playlist.songs = songs;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    const updated = await playlist.save();
    return res.status(200).json({
      message: 'Playlist updated successfully',
      playlist: updated,
    });
  } catch (err) {
    console.error('Error updating playlist:', err);
    return res.status(500).json({ message: 'Server error updating playlist' });
  }
};

// 4. DELETE PLAYLIST
// DELETE /api/playlists/:id
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid playlist ID' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (!canModifyPlaylist(playlist, req.user)) {
      return res.status(403).json({ message: 'Not allowed to delete this playlist' });
    }
    await playlist.deleteOne();
    return res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    return res.status(500).json({ message: 'Server error deleting playlist' });
  }
};

// 5. MUSIC SEARCH API
// GET /api/search?query=...
// Uses iTunes Search API as an example and returns external links
exports.searchMusic = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Example: iTunes Search API (no auth needed)
    const url = 'https://itunes.apple.com/search';
    const response = await axios.get(url, {
      params: {
        term: query,
        media: 'music',
        limit: 15,
      },
    });

    const results = (response.data.results || []).map((item) => {
      const artist = item.artistName;
      const track = item.trackName || item.collectionName || query;
      const searchTerm = encodeURIComponent(`${artist} ${track}`);
      const spotifyUrl = `https://open.spotify.com/search/${searchTerm}`;
      const appleMusicUrl = `https://music.apple.com/us/search?term=${searchTerm}`;

      return {
        artist,
        track,
        album: item.collectionName,
        previewUrl: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        externalLinks: {
          spotify: spotifyUrl,
          appleMusic: appleMusicUrl,
        },
      };
    });

    return res.status(200).json({
      query,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error('Error searching music API:', err);

    // Handle invalid upstream responses or network errors
    return res.status(502).json({
      message: 'Error contacting music search service',
    });
  }
};
