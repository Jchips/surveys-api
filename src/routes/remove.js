'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Remove } = require('../models');

const router = express.Router();

// ------ Routes -----

router.post('/', bearerAuth, acl('read'), handleRemove);

// ------ Handlers -----

async function handleRemove(req, res, next) {
  try {
    let remove = req.body;
    let removedSurvey = await Remove.create(remove);
    res.status(201).json(removedSurvey);
  } catch (err) {
    console.error(err);
    next();
  }
}

module.exports = router;
