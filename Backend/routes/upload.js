const express = require('express');
const multer = require('multer');
const path = require('path');
const Song = require('../models/Song');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
router.post('/song', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded',
    file: req.file
  });
});
function fileFilter(req, file, cb) {
  if (file.mimetype !== 'audio/mpeg') {
    return cb(new Error('Only MP3 files allowed'), false);
  }
  cb(null, true);
}

function fileFilter(req, file, cb) {
  if (file.mimetype !== 'audio/mpeg')
    return cb(new Error('Only MP3 files allowed'), false);
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
router.post('/song', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const song = await Song.create({
    title: req.file.originalname,
    owner: req.user._id,
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype
  });

  res.json({
    message: 'Upload successful',
    filename: req.file.filename,
    path: req.file.path
  });
});
module.exports = router;
