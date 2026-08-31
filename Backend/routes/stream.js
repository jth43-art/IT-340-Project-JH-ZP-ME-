const express = require('express');
const router = express.Router();

const Song = require('../models/Song');
const streamController = require('../controllers/streamController');
const auth = require('../middleware/auth');

// ==========================================
// GET ALL UPLOADED SONGS
// GET /api/songs
// ==========================================

router.get('/songs', auth, async (req, res) => {
  try {
    const songs = await Song.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: songs.length,
      songs
    });

  } catch (err) {
    console.error(
      'Error retrieving songs:',
      err
    );

    return res.status(500).json({
      message: 'Failed to retrieve songs'
    });
  }
});

// ==========================================
// STREAM UPLOADED SONG
// GET /api/songs/:id/stream
// ==========================================

router.get(
  '/songs/:id/stream',
  auth,
  streamController.streamSong
);

module.exports = router;
