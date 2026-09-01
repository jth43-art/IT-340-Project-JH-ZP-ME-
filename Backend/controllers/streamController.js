const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Song = require('../models/Song');

// ==========================================
// STREAM UPLOADED SONG
// GET /api/songs/:id/stream
// ==========================================

exports.streamSong = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------
    // Validate MongoDB song ID
    // ------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid song ID'
      });
    }

    // ------------------------------------------
    // Find song in MongoDB
    // ------------------------------------------

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        message: 'Song not found'
      });
    }

    // ------------------------------------------
    // Security check
    // User must own song unless they are admin
    // ------------------------------------------

    const isOwner =
      song.owner &&
      req.user &&
      song.owner.toString() === req.user._id.toString();

    const isAdmin =
      req.user &&
      req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You do not have permission to play this song'
      });
    }

    // ------------------------------------------
    // Confirm song has an uploaded file
    // ------------------------------------------

    if (!song.filePath) {
      return res.status(404).json({
        message: 'This song does not have an uploaded MP3'
      });
    }

    const uploadsDirectory =
      path.resolve(
        __dirname,
        '..',
        'uploads'
      );

    let filePath;

    // New uploads normally contain an absolute path
    if (path.isAbsolute(song.filePath)) {
      filePath = path.resolve(song.filePath);
    } else {
      // Handle older relative paths such as:
      // uploads/123-song.mp3
      // or simply 123-song.mp3

      const fileName =
        path.basename(song.filePath);

      filePath =
        path.join(
          uploadsDirectory,
          fileName
        );
    }

    // ------------------------------------------
    // Prevent paths outside Backend/uploads
    // ------------------------------------------

    const relativePath =
      path.relative(
        uploadsDirectory,
        filePath
      );

    if (
      relativePath.startsWith('..') ||
      path.isAbsolute(relativePath)
    ) {
      console.error(
        'Invalid stored song path:',
        song.filePath
      );

      return res.status(403).json({
        message: 'Invalid song file path'
      });
    }

    // ------------------------------------------
    // Make sure MP3 still exists on disk
    // ------------------------------------------

    if (!fs.existsSync(filePath)) {
      console.error(
        'Song file not found on disk:',
        filePath
      );

      return res.status(404).json({
        message: 'MP3 file not found on server'
      });
    }

    const stat =
      fs.statSync(filePath);

    const fileSize =
      stat.size;

    const range =
      req.headers.range;

    const contentType =
      song.mimeType ||
      'audio/mpeg';

    // ------------------------------------------
    // NORMAL FULL FILE RESPONSE
    // ------------------------------------------

    if (!range) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      });

      fs.createReadStream(filePath)
        .pipe(res);

      return;
    }

    // ------------------------------------------
    // RANGE STREAMING
    // Allows seeking / partial playback
    // ------------------------------------------

    const parts =
      range
        .replace(/bytes=/, '')
        .split('-');

    const start =
      parseInt(parts[0], 10);

    const end =
      parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

    // Validate requested byte range
    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      start < 0 ||
      end >= fileSize ||
      start > end
    ) {
      res.status(416);

      res.setHeader(
        'Content-Range',
        `bytes */${fileSize}`
      );

      return res.end();
    }

    const chunkSize =
      end - start + 1;

    res.writeHead(206, {
      'Content-Type': contentType,
      'Content-Range':
        `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(
      filePath,
      {
        start,
        end
      }
    ).pipe(res);

  } catch (err) {
    console.error(
      'Stream song error:',
      err
    );

    return res.status(500).json({
      message: 'Unable to stream this song'
    });
  }
};
