'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Remove } = require('../models');

const router = express.Router();

// ------ Routes -----

router.post('/', bearerAuth, acl('read'), handleCreate);
router.delete('/:survey_id', bearerAuth, acl('deleteSurvey'), handleDelete);

// ------ Handlers -----

// Adds a survey to the Remove table
async function handleCreate(req, res, next) {
  try {
    let remove = req.body;
    let removedSurvey = await Remove.create(remove);
    res.status(201).json(removedSurvey);
  } catch (err) {
    console.error(err);
    next();
  }
}

// Deletes all Remove items for a given survey
async function handleDelete(req, res, next) {
  try {
    let { survey_id } = req.params;
    await Remove.destroy({ where: { survey_id } });
    res.status(200).send('deleted all survey removes');
  } catch (err) {
    console.error(err);
    next();
  }
}

module.exports = router;
