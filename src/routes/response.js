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
router.delete('/:surveyId', bearerAuth, acl('deleteSurvey'), handleDelete);

// ------ Handlers -----

// Get all the responses from a survey that user has created
async function handleGetAll(req, res, next) {
  try {
    let { surveyId } = req.params;
    let allResponses = await Response.findAll({ where: { surveyId }, order: [['createdAt', 'DESC']] });
    res.status(200).json(allResponses);
  } catch (err) {
    next(err);
  }
}

// Creates a response
async function handleCreate(req, res, next) {
  try {
    let userResponse = req.body;
    let response = await Response.create(userResponse);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

// Deletes all responses to a given survey
async function handleDelete(req, res, next) {
  try {
    let { surveyId } = req.params;
    await Response.destroy({ where: { surveyId } });
    res.status(200).send('deleted all survey responses');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
