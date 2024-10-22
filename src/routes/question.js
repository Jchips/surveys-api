'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { Question } = require('../models');

const router = express.Router();

// ------ Routes -----
router.get('/:survey_id', bearerAuth, acl('read'), handleGetAll);
router.post('/', bearerAuth, acl('createSurvey'), handleCreate); // not being used
router.delete('/:survey_id', bearerAuth, acl('createSurvey'), handleDelete); // not being used

// ------ Handlers -----
// fetch all the questions for a given survey
async function handleGetAll(req, res, next) {
  try {
    let { survey_id } = req.params;
    let allSurveyQs = await Question.findAll({ where: { survey_id }, order: [['qIndex', 'ASC']] });
    res.status(200).json(allSurveyQs);
  } catch (err) {
    console.error(err);
    next();
  }
}

// Adds a question to the Questions table
async function handleCreate(req, res, next) {
  try {
    let qBody = req.body;
    let newQuestion = await Question.create(qBody);
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error(err);
    next();
  }
}

// Deletes all questions for a given survey
async function handleDelete(req, res, next) {
  try {
    let { survey_id } = req.params;
    await Question.destroy({ where: { survey_id } });
    res.status(200).send('deleted all questions from survey');
  } catch (err) {
    console.error(err);
    next();
  }
}

module.exports = router;
