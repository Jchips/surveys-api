'use strict';

const express = require('express');
const { Op } = require('sequelize');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const checkUser = require('../auth/middleware/check');
const { db } = require('../auth/models');
const { Survey } = require('../models');
const { Question } = require('../models');

const router = express.Router();

// ------ Routes -----

router.get('/', bearerAuth, acl('read'), handleGetAll);
router.get('/:username/:uid', bearerAuth, acl('read'), handleGetFeed);
router.get('/:surveyId', bearerAuth, acl('read'), handleGetOne);
router.post('/', bearerAuth, acl('createSurvey'), handleCreate);
router.delete('/:surveyId', bearerAuth, acl('deleteSurvey'), checkUser, handleDelete);

// ------ Handlers -----

// Gets all surveys in database
// Query parameter for createdBy to get all surveys from a specific user
// Sends object with all surveys found
async function handleGetAll(req, res, next) {
  try {
    let queryObj = {};
    if (req.query.createdBy) {
      queryObj = {
        where: { createdBy: req.query.createdBy },
        order: [['createdAt', 'DESC']],
        include: {
          model: Question,
          as: 'qs',
          separate: true,
          order: [['qIndex', 'ASC']],
        },
      };
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
    let queryObj = {
      where: {
        createdBy: { [Op.ne]: username },
        id: {
          [Op.notIn]: db.literal(
            `(SELECT survey_id FROM "Removes" WHERE user_id = '${uid}'
            UNION
            SELECT survey_id FROM "Responders" WHERE user_id = '${uid}')`,
          ),
        },
      },
      include: [
        {
          model: Question,
          as: 'qs',
          separate: true,
          order: [['qIndex', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    };
    let userFeed = await Survey.findAll(queryObj);
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
    let survey = await Survey.findOne({
      where: { id: surveyId }, include: {
        model: Question,
        as: 'qs',
        separate: true,
        order: [['qIndex', 'ASC']],
      },
    });
    res.status(200).json(survey);
  } catch (err) {
    next(err);
  }
}

// Creates a new survey
// Sends object with newly created survey
async function handleCreate(req, res, next) {
  const transaction = await db.transaction();
  try {
    let { surveyBody, questions } = req.body;
    let addedSurvey = await Survey.create(surveyBody, { transaction });
    const qs = questions.map((q) => ({
      ...q,
      survey_id: addedSurvey.id,
    }));
    await Question.bulkCreate(qs, { transaction });
    await transaction.commit();
    res.status(201).json({ addedSurvey, qs });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    next(err);
  }
}

// Deletes a survey
// Sends message saying 'deleted survey'
async function handleDelete(req, res, next) {
  try {
    let { surveyId } = req.params;
    await Survey.destroy({ where: { id: surveyId } });
    res.status(200).send('deleted survey');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = router;
