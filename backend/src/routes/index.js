const express = require('express');
const router = express.Router();


const authRoutes = require('./routes_auth');
const goalRoutes = require('./routes_goal');
const taskRoutes = require('./routes_task');
const sessionRoutes = require('./routes_session');
const docRoutes = require('./routes_document');
const noteRoutes = require('./routes_note');
const notifRoutes = require('./routes_notification');


router.use('/auth', authRoutes);
router.use('/goals', goalRoutes);
router.use('/tasks', taskRoutes);
router.use('/sessions', sessionRoutes);
router.use('/documents', docRoutes);
router.use('/notes', noteRoutes);
router.use('/notifications', notifRoutes);


module.exports = router;