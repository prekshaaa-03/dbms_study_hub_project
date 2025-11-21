require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const path = require('path');


app.use(cors());
app.use(express.json());
// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api', routes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Backend running on', PORT));