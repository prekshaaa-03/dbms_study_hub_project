const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  const userId = req.user.UserID;

  try {
    const [rows] = await pool.query(
      `SELECT n.*
       FROM notification n
       LEFT JOIN task t ON n.TaskID = t.TaskID
       LEFT JOIN studysession s ON n.SessionID = s.SessionID
       LEFT JOIN goal g ON COALESCE(t.GoalID, s.GoalID) = g.GoalID
       WHERE g.UserID = ? OR (n.TaskID IS NULL AND n.SessionID IS NULL)`,
      [userId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
