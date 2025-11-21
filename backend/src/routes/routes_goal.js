const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


// Create goal
router.post('/', auth, async (req,res)=>{
const {Title,Description,DueDate} = req.body;
const userId = req.user.UserID;
try{
const [result] = await pool.query('INSERT INTO goal (Title,Description,DueDate,UserID) VALUES (?,?,?,?)',[Title,Description,DueDate,userId]);
res.json({GoalID: result.insertId});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// List user's goals
router.get('/', auth, async (req,res)=>{
const userId = req.user.UserID;
try{
const [rows] = await pool.query('SELECT * FROM goal WHERE UserID = ? ORDER BY DueDate ASC', [userId]);
res.json(rows);
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// Get goal detail
router.get('/:id', auth, async (req,res)=>{
const id = req.params.id; const userId = req.user.UserID;
try{
const [rows] = await pool.query('SELECT * FROM goal WHERE GoalID = ? AND UserID = ?', [id,userId]);
if(!rows.length) return res.status(404).json({message:'Not found'});
res.json(rows[0]);
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// Update
router.put('/:id', auth, async (req,res)=>{
const id=req.params.id; const {Title,Description,DueDate}=req.body; const userId=req.user.UserID;
try{
await pool.query('UPDATE goal SET Title=?,Description=?,DueDate=? WHERE GoalID=? AND UserID=?',[Title,Description,DueDate,id,userId]);
res.json({message:'Updated'});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


// Delete
router.delete('/:id', auth, async (req,res)=>{
const id=req.params.id; const userId=req.user.UserID;
try{
await pool.query('DELETE FROM goal WHERE GoalID=? AND USERID=?',[id,userId]);
res.json({message:'Deleted'});
}catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
});


module.exports = router;