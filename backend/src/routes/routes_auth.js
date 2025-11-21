const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Register
router.post('/register', async (req,res)=>{
const {name,email,password} = req.body;
if(!email||!password) return res.status(400).json({message:'Missing fields'});
try{
const [rows] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
if(rows.length) return res.status(400).json({message:'Email exists'});
const hash = await bcrypt.hash(password, 10);
const [result] = await pool.query('INSERT INTO user (Name,Email,Password) VALUES (?,?,?)',[name,email,hash]);
const userId = result.insertId;
const token = jwt.sign({UserID:userId,Email:email}, process.env.JWT_SECRET, {expiresIn:'7d'});
res.json({token});
}catch(err){
console.error(err);
res.status(500).json({message:'Server error'});
}
});


// Login
router.post('/login', async (req,res)=>{
const {email,password} = req.body;
if(!email||!password) return res.status(400).json({message:'Missing fields'});
try{
const [rows] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
if(!rows.length) return res.status(400).json({message:'Invalid credentials'});
const user = rows[0];
const ok = await bcrypt.compare(password, user.Password);
if(!ok) return res.status(400).json({message:'Invalid credentials'});
const token = jwt.sign({UserID:user.UserID,Email:user.Email}, process.env.JWT_SECRET, {expiresIn:'7d'});
res.json({token});
}catch(err){
console.error(err);
res.status(500).json({message:'Server error'});
}
});


module.exports = router;