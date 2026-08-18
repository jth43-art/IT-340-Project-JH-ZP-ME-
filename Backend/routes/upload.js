const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Song = require('../models/Song');

const router = express.Router();

// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDirectory = path.join(__dirname, '..', 'uploads');

// Create uploads folder if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  }
});

// ==========================================
// MP3 FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
  const extension =
    path.extname(file.originalname).toLowerCase();

  const validExtension =
    extension === '.mp3';

  const validMimeType =
    file.mimetype === 'audio/mpeg' ||
    file.mimetype === 'audio/mp3';

  if (!validExtension || !validMimeType) {
    return cb(
      new Error('Only MP3 files are allowed'),
      false
    );
  }

  cb(null, true);
};

// ==========================================
// MULTER CONFIGURATION
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter
});

// ==========================================
// UPLOAD SONG
// POST /api/upload/song
// ==========================================

router.post(
  '/song',
  upload.single('file'),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: 'No MP3 file uploaded'
        });
      }

      // This route expects the authentication
      // middleware in server.js to provide req.user.
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }

      // Use provided title or fall back
      // to the original MP3 filename.
      const defaultTitle =
        path.basename(
          req.file.originalname,
          path.extname(req.file.originalname)
        );

      const title =
        typeof req.body.title === 'string' &&
        req.body.title.trim()
          ? req.body.title.trim()
          : defaultTitle;

      const artist =
        typeof req.body.artist === 'string'
          ? req.body.artist.trim()
          : '';

      const album =
        typeof req.body.album === 'string'
          ? req.body.album.trim()
          : '';

      const genre =
        typeof req.body.genre === 'string'
          ? req.body.genre.trim()
          : '';

      let duration = null;

      if (
        req.body.duration !== undefined &&
        req.body.duration !== ''
      ) {
        const parsedDuration =
          Number(req.body.duration);

        if (
          Number.isFinite(parsedDuration) &&
          parsedDuration >= 0
        ) {
          duration = parsedDuration;
        }
      }

      // ======================================
      // SAVE SONG TO MONGODB
      // ======================================

      const song = await Song.create({
        title,
        artist,
        album,
        genre,
        duration,

        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,

        albumArtworkPath:
          req.body.albumArtworkPath || null,

        owner:
          req.user._id
      });

      return res.status(201).json({
        message: 'Song uploaded successfully',
        song
      });

    } catch (err) {
      console.error(
        'Song upload error:',
        err
      );

      return res.status(500).json({
        message: 'Error uploading song'
      });
    }
  }
);

module.exports = router;
