const express = require('express');
const app = express();
const path = require('path');

const PORT = 5000;

// Serve static files (your HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API routes (for your Angular service later if needed)
app.get('/now-playing', (req, res) => {
  res.json({ song: "Song Title", artist: "Artist Name" });
});

app.get('/recent', (req, res) => {
  res.json(["Song 1", "Song 2"]);
});

app.get('/playlists', (req, res) => {
  res.json(["Playlist 1", "Playlist 2"]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
