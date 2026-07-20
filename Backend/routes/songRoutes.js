const express = require('express');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const router = express.Router();

router.get('/:id/stream', async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song || !song.filePath)
    return res.status(404).json({ message: 'Song not found' });
  const filePath = path.resolve(song.filePath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile())
      return res.status(404).json({ message: 'File missing' });
    const range = req.headers.range;
    const fileSize = stats.size;
    if (!range) {
      res.writeHead(200, {
        'Content-Type': song.mimeType,
        'Content-Length': fileSize
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': song.mimeType
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    }
  });
});
module.exports = router;
