const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// ===============================
// Create study session
// ===============================
router.post('/', auth, async (req, res) => {
  const { EndTime, Duration, GoalID } = req.body;
  const userId = req.user.UserID;

  try {
    // Check if goal belongs to logged-in user
    const [grows] = await pool.query(
      'SELECT * FROM goal WHERE GoalID = ? AND UserID = ?',
      [GoalID, userId]
    );
    if (!grows.length)
      return res.status(403).json({ message: 'Not allowed' });

    // Insert session
    const [r] = await pool.query(
      'INSERT INTO studysession (EndTime, Duration, GoalID) VALUES (?,?,?)',
      [EndTime, Duration, GoalID]
    );

    res.json({ SessionID: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===============================
// List sessions for a specific goal
// ===============================
router.get('/goal/:goalId', auth, async (req, res) => {
  const goalId = req.params.goalId;
  const userId = req.user.UserID;

  try {
    // Ensure user owns the goal
    const [grows] = await pool.query(
      'SELECT * FROM goal WHERE GoalID = ? AND UserID = ?',
      [goalId, userId]
    );
    if (!grows.length)
      return res.status(403).json({ message: 'Not allowed' });

    // Fetch sessions
    const [rows] = await pool.query(
      'SELECT * FROM studysession WHERE GoalID = ?',
      [goalId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
