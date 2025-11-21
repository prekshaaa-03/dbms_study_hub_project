const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const file = req.file;
  const userId = req.user.UserID;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const [result] = await pool.query(
      'INSERT INTO document (FileName, FileType, UploadDate, Size, UserID) VALUES (?,?,?,?,?)',
      [
        file.filename,
        path.extname(file.originalname).substring(1),
        new Date(),
        (file.size / 1024).toFixed(2) + 'KB',
        userId,
      ]
    );

    res.json({
      DocumentID: result.insertId,
      fileUrl: `/uploads/${file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  const userId = req.user.UserID;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM document WHERE UserID = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
