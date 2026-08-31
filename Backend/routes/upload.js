const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Song = require('../models/Song');

const router = express.Router();

// ==========================================
// UPLOAD DIRECTORY
// ==========================================

const uploadDirectory =
  path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(
    uploadDirectory,
    { recursive: true }
  );
}

// ==========================================
// STORAGE
// ==========================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname)
        .toLowerCase();

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, uniqueName);
  }
});

// ==========================================
// FILE VALIDATION
// ==========================================

const fileFilter = (req, file, cb) => {

  const extension =
    path.extname(file.originalname)
      .toLowerCase();

  // MP3 field
  if (file.fieldname === 'file') {

    const validMp3 =
      extension === '.mp3' &&
      (
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'audio/mp3' ||
        file.mimetype === 'application/octet-stream'
      );

    if (!validMp3) {
      return cb(
        new Error(
          'Only MP3 files are allowed'
        ),
        false
      );
    }

    return cb(null, true);
  }

  // Artwork field
  if (file.fieldname === 'artwork') {

    const validImage =
      (
        extension === '.jpg' ||
        extension === '.jpeg' ||
        extension === '.png' ||
        extension === '.webp'
      ) &&
      (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp'
      );

    if (!validImage) {
      return cb(
        new Error(
          'Artwork must be a JPG, PNG, or WebP image'
        ),
        false
      );
    }

    return cb(null, true);
  }

  return cb(
    new Error('Unexpected upload field'),
    false
  );
};

// ==========================================
// MULTER
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

  upload.fields([
    {
      name: 'file',
      maxCount: 1
    },
    {
      name: 'artwork',
      maxCount: 1
    }
  ]),

  async (req, res) => {

    try {

      if (!req.user || !req.user._id) {
        return res.status(401).json({
          message: 'Authentication required'
        });
      }

      const audioFile =
        req.files?.file?.[0];

      const artworkFile =
        req.files?.artwork?.[0] || null;

      if (!audioFile) {
        return res.status(400).json({
          message: 'No MP3 file uploaded'
        });
      }

      const defaultTitle =
        path.basename(
          audioFile.originalname,
          path.extname(
            audioFile.originalname
          )
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

      const song =
        await Song.create({

          title,

          artist,

          album,

          genre,

          filePath:
            audioFile.path,

          fileSize:
            audioFile.size,

          mimeType:
            audioFile.mimetype,

          albumArtworkPath:
            artworkFile
              ? artworkFile.path
              : null,

          owner:
            req.user._id
        });

      return res.status(201).json({
        message:
          'Song uploaded successfully',

        song
      });

    } catch (err) {

      console.error(
        'Song upload error:',
        err
      );

      return res.status(500).json({
        message:
          'Error uploading song'
      });
    }
  }
);

// ==========================================
// MULTER ERROR HANDLER
// ==========================================

router.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    console.error(
      'Multer error:',
      err
    );

    return res.status(400).json({
      message:
        `Upload error: ${err.message}`
    });
  }

  if (err) {

    console.error(
      'Upload validation error:',
      err
    );

    return res.status(400).json({
      message:
        err.message ||
        'Invalid upload'
    });
  }

  next();
});

module.exports = router;
