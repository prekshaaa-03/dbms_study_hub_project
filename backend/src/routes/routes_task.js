const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


// Create task (for a goal)
router.post('/', auth, async (req,res)=>{
const {Title,Deadline,Priority,GoalID} = req.body; const userId = req.user.UserID;
// Basic ownership check: ensure goal belongs to user
try{
const [grows] = await pool.query('SELECT * FROM goal WHERE GoalID = ? AND UserID = ?', [GoalID,userId]);
if(!grows.length) return res.status(403).json({message:'Not allowed'});
const [r] = await pool.query('INSERT INTO task (Title,Deadline,Priority,GoalID) VALUES (?,?,?,?)',[Title,Deadline,Priority,GoalID]);
res.json({TaskID: r.insertId});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// List tasks for a goal
router.get('/goal/:goalId', auth, async (req,res)=>{
const goalId = req.params.goalId; const userId = req.user.UserID;
try{
const [grows] = await pool.query('SELECT * FROM goal WHERE GoalID = ? AND USERID = ?', [goalId,userId]);
if(!grows.length) return res.status(403).json({message:'Not allowed'});
const [rows] = await pool.query('SELECT * FROM task WHERE GoalID = ?', [goalId]);
res.json(rows);
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// Update task
router.put('/:id', auth, async (req,res)=>{
const id=req.params.id; const {Title,Deadline,Priority}=req.body; const userId=req.user.UserID;
try{
// ensure ownership via join
const [rows] = await pool.query('SELECT t.* FROM task t JOIN goal g ON t.GoalID=g.GoalID WHERE t.TaskID=? AND g.USERID=?',[id,userId]);
if(!rows.length) return res.status(403).json({message:'Not allowed'});
await pool.query('UPDATE task SET Title=?,Deadline=?,Priority=? WHERE TaskID=?',[Title,Deadline,Priority,id]);
res.json({message:'Updated'});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// Delete task
router.delete('/:id', auth, async (req,res)=>{
const id=req.params.id; const userId=req.user.UserID;
try{
const [rows] = await pool.query('SELECT t.* FROM task t JOIN goal g ON t.GoalID=g.GoalID WHERE t.TaskID=? AND g.USERID=?',[id,userId]);
if(!rows.length) return res.status(403).json({message:'Not allowed'});
await pool.query('DELETE FROM task WHERE TASKID=?',[id]);
res.json({message:'Deleted'});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


module.exports = router;