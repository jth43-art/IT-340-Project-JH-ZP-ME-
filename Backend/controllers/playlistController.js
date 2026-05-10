const Playlist = require('../models/Playlist');
const mongoose = require('mongoose');
function canModify(playlist, user) {
  if (!user) return false;
  const owner = playlist.owner?.toString() === user._id.toString();
  const admin = user.role === 'admin';
  return owner || admin;
}

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
    res.status(500).json({ message: 'Error creating playlist' });
  }
};

exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      $or: [{ owner: req.user._id }, { isPublic: true }]
    });
    res.json({ playlists });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching playlists' });
  }
};

exports.updatePlaylist = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID' });
  const playlist = await Playlist.findById(id);
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  if (!canModify(playlist, req.user))
    return res.status(403).json({ message: 'Forbidden' });
  Object.assign(playlist, req.body);
  await playlist.save();
  res.json({ playlist });
};

exports.deletePlaylist = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: 'Invalid ID' });
  const playlist = await Playlist.findById(id);
  if (!playlist) return res.status(404).json({ message: 'Not found' });
  if (!canModify(playlist, req.user))
    return res.status(403).json({ message: 'Forbidden' });
  await playlist.deleteOne();
  res.json({ message: 'Deleted' });
};
