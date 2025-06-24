// src/legacy/app.js

const express = require('express');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const router = express.Router();

router.use('/', indexRouter);
router.use('/users', usersRouter);

module.exports = router;