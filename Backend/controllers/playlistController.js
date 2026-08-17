const Playlist = require('../models/Playlist');
const mongoose = require('mongoose');
const log = require('../utils/logger');

function getUserLabel(user) {
  if (!user) return 'unknown user';

  return user.email || user.username || user._id || 'unknown user';
}

function getPlaylistTitle(playlist) {
  if (!playlist) return 'unknown playlist';

  return playlist.title || playlist.name || 'unknown playlist';
}

function canModify(playlist, user) {
  if (!user) return false;

  const owner =
    playlist.owner?.toString() === user._id.toString();

  const admin =
    user.role === 'admin';

  return owner || admin;
}

function buildSpotifyUrl(song) {
  const title =
    song.title || song.track || '';

  const artist =
    song.artist || '';

  const query = encodeURIComponent(
    `${title} ${artist}`.trim()
  );

  return (
    song.url ||
    song.spotifyUrl ||
    song.externalLinks?.spotify ||
    `https://open.spotify.com/search/${query}`
  );
}

// ==========================================
// CREATE PLAYLIST
// ==========================================

exports.createPlaylist = async (req, res) => {
  try {
    const playlistTitle =
      req.body.title || req.body.name;

    log(
      `PLAYLIST create attempt by ${getUserLabel(req.user)}: ${playlistTitle}`
    );

    if (!playlistTitle || !playlistTitle.trim()) {
      log(
        `PLAYLIST create failed by ${getUserLabel(req.user)}: missing title`
      );

      return res.status(400).json({
        message: 'Playlist title is required'
      });
    }

    const playlist = await Playlist.create({
      title: playlistTitle.trim(),

      description:
        req.body.description || '',

      songs:
        req.body.songs || [],

      isPublic:
        req.body.isPublic || false,

      owner:
        req.user._id
    });

    log(
      `PLAYLIST create success by ${getUserLabel(req.user)}: ${playlist.title}`
    );

    return res.status(201).json({
      playlist
    });

  } catch (err) {
    log(
      `PLAYLIST create failed by ${getUserLabel(req.user)}: ${err.message}`
    );

    console.error(
      'Error creating playlist:',
      err
    );

    return res.status(500).json({
      message: 'Error creating playlist'
    });
  }
};

// ==========================================
// GET PLAYLISTS
// ==========================================

exports.getPlaylists = async (req, res) => {
  try {
    log(
      `PLAYLIST fetch attempt by ${getUserLabel(req.user)}`
    );

    let playlists;

    if (
      req.user.role === 'admin' &&
      req.query.admin === 'true'
    ) {
      playlists = await Playlist.find({});
    } else {
      playlists = await Playlist.find({
        $or: [
          { owner: req.user._id },
          { isPublic: true }
        ]
      });
    }

    log(
      `PLAYLIST fetch success by ${getUserLabel(req.user)}: ${playlists.length} playlist(s)`
    );

    return res.json({
      playlists
    });

  } catch (err) {
    log(
      `PLAYLIST fetch failed by ${getUserLabel(req.user)}: ${err.message}`
    );

    console.error(
      'Error fetching playlists:',
      err
    );

    return res.status(500).json({
      message: 'Error fetching playlists'
    });
  }
};

// ==========================================
// UPDATE PLAYLIST
// ==========================================

exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    log(
      `PLAYLIST update attempt by ${getUserLabel(req.user)}: ${id}`
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      log(
        `PLAYLIST update failed by ${getUserLabel(req.user)}: invalid ID ${id}`
      );

      return res.status(400).json({
        message: 'Invalid ID'
      });
    }

    const playlist =
      await Playlist.findById(id);

    if (!playlist) {
      log(
        `PLAYLIST update failed by ${getUserLabel(req.user)}: playlist not found ${id}`
      );

      return res.status(404).json({
        message: 'Not found'
      });
    }

    if (!canModify(playlist, req.user)) {
      log(
        `UNAUTHORIZED playlist update attempt by ${getUserLabel(req.user)}: ${id}`
      );

      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    if (
      req.body.name &&
      !req.body.title
    ) {
      req.body.title = req.body.name;
      delete req.body.name;
    }

    Object.assign(
      playlist,
      req.body
    );

    await playlist.save();

    log(
      `PLAYLIST update success by ${getUserLabel(req.user)}: ${getPlaylistTitle(playlist)}`
    );

    return res.json({
      playlist
    });

  } catch (err) {
    log(
      `PLAYLIST update failed by ${getUserLabel(req.user)}: ${err.message}`
    );

    console.error(
      'Error updating playlist:',
      err
    );

    return res.status(500).json({
      message: 'Error updating playlist'
    });
  }
};

// ==========================================
// DELETE PLAYLIST
// ==========================================

exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    log(
      `PLAYLIST delete attempt by ${getUserLabel(req.user)}: ${id}`
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      log(
        `PLAYLIST delete failed by ${getUserLabel(req.user)}: invalid ID ${id}`
      );

      return res.status(400).json({
        message: 'Invalid ID'
      });
    }

    const playlist =
      await Playlist.findById(id);

    if (!playlist) {
      log(
        `PLAYLIST delete failed by ${getUserLabel(req.user)}: playlist not found ${id}`
      );

      return res.status(404).json({
        message: 'Not found'
      });
    }

    if (!canModify(playlist, req.user)) {
      log(
        `UNAUTHORIZED playlist delete attempt by ${getUserLabel(req.user)}: ${id}`
      );

      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    const playlistTitle =
      getPlaylistTitle(playlist);

    await playlist.deleteOne();

    log(
      `PLAYLIST delete success by ${getUserLabel(req.user)}: ${playlistTitle}`
    );

    return res.json({
      message: 'Deleted'
    });

  } catch (err) {
    log(
      `PLAYLIST delete failed by ${getUserLabel(req.user)}: ${err.message}`
    );

    console.error(
      'Error deleting playlist:',
      err
    );

    return res.status(500).json({
      message: 'Error deleting playlist'
    });
  }
};

// ==========================================
// ADD SONG TO PLAYLIST
// ==========================================

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const song =
      req.body.song || {};

    log(
      `SONG add attempt by ${getUserLabel(req.user)} to playlist ${id}`
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid playlist ID'
      });
    }

    const playlist =
      await Playlist.findById(id);

    if (!playlist) {
      log(
        `SONG add failed by ${getUserLabel(req.user)}: playlist not found ${id}`
      );

      return res.status(404).json({
        message: 'Playlist not found'
      });
    }

    if (!canModify(playlist, req.user)) {
      log(
        `UNAUTHORIZED song add attempt by ${getUserLabel(req.user)}: ${id}`
      );

      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    const title =
      song.title ||
      song.track ||
      'Untitled Song';

    const artist =
      song.artist ||
      'Unknown Artist';

    const spotifyUrl =
      buildSpotifyUrl(song);

    playlist.songs.push({
      title,

      artist,

      album:
        song.album || '',

      image:
        song.image ||
        song.artworkUrl ||
        song.albumArtworkPath ||
        '',

      artworkUrl:
        song.artworkUrl ||
        song.albumArtworkPath ||
        '',

      source:
        song.source ||
        (song.filePath ? 'upload' : 'api'),

      url:
        spotifyUrl,

      previewUrl:
        song.previewUrl || '',

      filePath:
        song.filePath || '',

      localFile:
        song.localFile || '',

      externalLinks: {
        spotify:
          spotifyUrl,

        appleMusic:
          song.externalLinks?.appleMusic || ''
      }
    });

    await playlist.save();

    log(
      `SONG add success by ${getUserLabel(req.user)} to playlist ${getPlaylistTitle(playlist)}`
    );

    return res.json({
      playlist
    });

  } catch (err) {
    log(
      `SONG add failed by ${getUserLabel(req.user)}: ${err.message}`
    );

    console.error(
      'Error adding song to playlist:',
      err
    );

    return res.status(500).json({
      message: 'Error adding song to playlist'
    });
  }
};
