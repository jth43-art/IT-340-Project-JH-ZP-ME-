const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/song', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded',
    file: req.file
  });
});

module.exports = router;
