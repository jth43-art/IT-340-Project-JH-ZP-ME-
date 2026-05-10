// routes/playlists.js
const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getPlaylists,
  updatePlaylist,
  deletePlaylist,
  searchMusic,
} = require('../controllers/playlistController');

// Simple auth middleware placeholder.
// Replace with your real auth (JWT, session, etc.).
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

// PLAYLIST CRUD ROUTES
// Base path example in app.js: app.use('/api/playlists', playlistRoutes);

router.post('/', requireAuth, createPlaylist);      // POST /api/playlists
router.get('/', requireAuth, getPlaylists);        // GET  /api/playlists
router.put('/:id', requireAuth, updatePlaylist);   // PUT  /api/playlists/:id
router.delete('/:id', requireAuth, deletePlaylist);// DEL  /api/playlists/:id

// MUSIC SEARCH ROUTE
// Example base path in app.js: app.use('/api', playlistRoutes);
// Then frontend calls: GET /api/search?query=...

router.get('/search', requireAuth, searchMusic);   // GET /api/playlists/search (if mounted at /api/playlists)
// OR if you mount at /api: this becomes /api/search

module.exports = router;
