'use strict';

const express = require('express');
const router = express.Router();
const sheet = require('./updatesheet');

const league = require('./league');
const { route } = require('./updatesheet');

// router.use('/league', league);
router.use('/update', sheet);

module.exports = router;
