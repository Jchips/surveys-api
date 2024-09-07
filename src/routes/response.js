'use strict';

const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const checkUser = require('../auth/middleware/check');
const acl = require('../auth/middleware/acl');
const { Response } = require('../models');

const router = express.Router();

// ------ Routes -----

router.get('/:surveyId', bearerAuth, acl('viewResponse'), checkUser, handleGetAll);
router.post('/', bearerAuth, acl('createResponse'), handleCreate);

// ------ Handlers -----

// Get all the responses from a survey that user has created
async function handleGetAll(req, res, next) {
  let { surveyId } = req.params;
  // let parsedSurveyId = parseInt(survey_id);
  try {
    let allResponses = await Response.findAll({ where: { surveyId } });
    res.status(200).json(allResponses);
  } catch (err) {
    next(err);
  }
}

// Creates a response
async function handleCreate(req, res, next) {
  let userResponse = req.body;
  try {
    let response = await Response.create(userResponse);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
