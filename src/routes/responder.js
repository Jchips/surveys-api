'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Responder } = require('../models');

const router = express.Router();

// ------ Routes -----
router.post('/', bearerAuth, acl('read'), handleCreate);

// ------ Handlers -----
// Add a responder
async function handleCreate(req, res, next) {
  try {
    let newResponder = req.body;
    let responder = await Responder.create(newResponder);
    res.status(201).json(responder);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = router;
