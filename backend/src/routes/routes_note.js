const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// ========================
// CREATE NOTE
// ========================
router.post('/', auth, async (req, res) => {
  const { Content, SessionID, DocumentID } = req.body;
  const userId = req.user.UserID;

  try {
    // Validate session
    if (SessionID) {
      const [rows] = await pool.query(
        `SELECT ss.* 
         FROM studysession ss
         JOIN goal g ON ss.GoalID = g.GoalID
         WHERE ss.SessionID = ? AND g.UserID = ?`,
        [SessionID, userId]
      );
      if (!rows.length) return res.status(403).json({ message: 'Not allowed' });
    }

    // Validate document
    if (DocumentID) {
      const [rows] = await pool.query(
        `SELECT * FROM document 
         WHERE DocumentID = ? AND UserID = ?`,
        [DocumentID, userId]
      );
      if (!rows.length) return res.status(403).json({ message: 'Not allowed' });
    }

    const [result] = await pool.query(
      `INSERT INTO note (Content, LastModified, SessionID, DocumentID)
       VALUES (?, ?, ?, ?)`,
      [Content, new Date(), SessionID || null, DocumentID || null]
    );

    res.json({ NoteID: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// GET NOTES FOR A SESSION
// ========================
router.get('/session/:sessionId', auth, async (req, res) => {
  const sessionId = req.params.sessionId;
  const userId = req.user.UserID;

  try {
    const [check] = await pool.query(
      `SELECT ss.* 
       FROM studysession ss
       JOIN goal g ON ss.GoalID = g.GoalID
       WHERE ss.SessionID = ? AND g.UserID = ?`,
      [sessionId, userId]
    );
    if (!check.length) return res.status(403).json({ message: 'Not allowed' });

    const [rows] = await pool.query(
      `SELECT * FROM note WHERE SessionID = ?`,
      [sessionId]
    );
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// UPDATE NOTE
// ========================
router.put('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { Content } = req.body;
  const userId = req.user.UserID;

  try {
    const [rows] = await pool.query(
      `SELECT n.*, d.UserID AS DocOwner, g.UserID AS GoalOwner
       FROM note n
       LEFT JOIN studysession ss ON n.SessionID = ss.SessionID
       LEFT JOIN goal g ON ss.GoalID = g.GoalID
       LEFT JOIN document d ON n.DocumentID = d.DocumentID
       WHERE n.NoteID = ?`,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: 'Not found' });

    const note = rows[0];
    const ownsNote = note.GoalOwner === userId || note.DocOwner === userId;

    if (!ownsNote) return res.status(403).json({ message: 'Not allowed' });

    await pool.query(
      `UPDATE note SET Content=?, LastModified=? WHERE NoteID=?`,
      [Content, new Date(), id]
    );

    res.json({ message: 'Updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
