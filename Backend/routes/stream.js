const express = require('express');
const router = express.Router();

const Song = require('../models/Song');
const streamController = require('../controllers/streamController');
const auth = require('../middleware/auth');

// ==========================================
// GET CURRENT USER'S UPLOADED SONGS
// GET /api/songs
// ==========================================

router.get('/songs', auth, async (req, res) => {
  try {

    const startTime = Date.now();

    console.log(
      `SONGS fetch started for user ${req.user._id}`
    );

    const songs = await Song.find({
      owner: req.user._id
    })
      .sort({
        createdAt: -1
      })
      .limit(100)
      .lean()
      .maxTimeMS(5000);

    const elapsed =
      Date.now() - startTime;

    console.log(
      `SONGS fetch completed: ${songs.length} song(s) in ${elapsed}ms`
    );

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
