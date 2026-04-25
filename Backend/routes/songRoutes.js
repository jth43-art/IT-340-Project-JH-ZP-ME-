const express = require('express');
const router = express.Router();
const songs = [
    { id: 1, title: "Song A", artist: "Artist A" },
    { id: 2, title: "Song B", artist: "Artist B" }
];

// GET all songs
router.get('/', (req, res) => {
    res.json(songs);
});

module.exports = router;
