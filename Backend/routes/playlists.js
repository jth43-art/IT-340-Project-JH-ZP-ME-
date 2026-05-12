const express = require('express');
const router = express.Router();
const controller = require('../controllers/playlistController');
router.post('/', controller.createPlaylist);
router.get('/', controller.getPlaylists);
router.put('/:id', controller.updatePlaylist);
router.delete('/:id', controller.deletePlaylist);
router.put('/:id/add-song', controller.addSongToPlaylist);
module.exports = router;
