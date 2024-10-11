'use strict';

const express = require('express');
const { QueryTypes } = require('sequelize');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const checkUser = require('../auth/middleware/check');
const { Survey } = require('../models');

const router = express.Router();

// ------ Routes -----

router.get('/', bearerAuth, acl('read'), handleGetAll);
router.get('/:username/:uid', bearerAuth, acl('read'), handleGetFeed);
router.get('/:surveyId', bearerAuth, acl('read'), handleGetOne);
router.post('/', bearerAuth, acl('createSurvey'), handleCreate);
router.patch('/:surveyId', bearerAuth, acl('read'), handleUpdateResps);
router.delete('/:surveyId', bearerAuth, acl('deleteSurvey'), checkUser, handleDelete);

// ------ Handlers -----

// Gets all surveys in database
// Query parameter for createdBy to get all surveys from a specific user
// Sends object with all surveys found
async function handleGetAll(req, res, next) {
  try {
    let queryObj = {};
    if (req.query.createdBy) {
      queryObj = { where: { createdBy: req.query.createdBy } };
    }
    let allSurveys = await Survey.findAll(queryObj);
    res.status(200).json(allSurveys);
  } catch (err) {
    next(err);
  }
}

// Gets all surveys that are not created of the user
// and that the user hasn't already answered.
// Sends object with all surveys that were created by the current user
// Used a raw SQL query in Sequelize because Sequelize way was not working
async function handleGetFeed(req, res, next) {
  try {
    let { username, uid } = req.params;
    const query = `
      SELECT DISTINCT s.*
      FROM "Surveys" s
      LEFT JOIN "Removes" r
      ON s.id = r.post_id AND r.user_id = :uid
      WHERE "createdBy" != :username
      AND NOT (:uid = ANY("responders"))
      AND r.user_id IS NULL;
    `;

    const replacements = { username, uid };
    let userFeed = await Survey.sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });
    res.status(200).json(userFeed);
  } catch (err) {
    next(err);
    console.error(err.message);
  }
}

// Gets a specific survey specified by its id
// Sends object with survey
async function handleGetOne(req, res, next) {
  let { surveyId } = req.params;
  try {
    let survey = await Survey.findOne({ where: { id: surveyId } });
    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
}

// Creates a new survey
// Sends object with newly created survey
async function handleCreate(req, res, next) {
  try {
    let newSurvey = req.body;
    let addedSurvey = await Survey.create(newSurvey);
    res.status(201).json(addedSurvey);
  } catch (err) {
    next(err);
  }
}

// Update responded surveys
async function handleUpdateResps(req, res, next) {
  let { surveyId } = req.params;
  let newResponder = req.body;
  try {
    let survey = await Survey.findOne({ where: { id: surveyId } });
    survey.responders = [...survey.responders, newResponder.responder];
    await survey.save();
    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
}

// Deletes a survey
// Sends message saying 'deleted survey'
async function handleDelete(req, res, next) {
  let { surveyId } = req.params;
  try {
    await Survey.destroy({ where: { id: surveyId } });
    res.status(200).send('deleted survey');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
