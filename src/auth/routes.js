'use strict';

const express = require('express');
// const { Op } = require('sequelize'); // PostgreSQL
const { User, db } = require('./models');
const { Response } = require('../models');
const acl = require('./middleware/acl');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');

const authRouter = express.Router();

// ------ Routes -----

authRouter.post('/signup', signup);
authRouter.post('/signin', basicAuth, signin);
authRouter.get('/users', bearerAuth, acl('deleteUser'), handleViewUsers);
authRouter.delete('/delete/:username/:id', bearerAuth, acl('read'), handleDeleteUser);

// ------ Handlers -----

// Sign up
async function signup(req, res, next) {
  try {
    let usernameTaken = await checkUsername(req.body.username);
    if (usernameTaken) {
      return res.json({ message: 'username is already taken' });
    }
    let newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

// Check for user
async function checkUsername(username) {
  try {
    let allUsers = await User.findOne({ where: { username: username } });
    return allUsers;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Sign in
async function signin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// View all users
async function handleViewUsers(req, res, next) {
  try {
    let allUsers = await User.findAll();
    const usernames = allUsers.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    }));
    res.status(200).json(usernames);
  } catch (err) {
    next(err);
  }
}

// Delete a user
async function handleDeleteUser(req, res, next) {
  try {
    let { id, username } = req.params;
    await User.destroy({ where: { id } });
    await handleHideUsername(username);
    res.status(200).send('user deleted');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

// Change a deleted user's username to '[deleted]' in their response
// If using PostgreSQL db, then change the `let responses` line to the following:
// let responses = await Response.findAll({ where: { response: { [Op.contains]: { username } } } });
async function handleHideUsername(username) {
  const transaction = await db.transaction();
  try {
    let responses = await db.query(
      `SELECT * FROM Responses WHERE JSON_CONTAINS(response, JSON_OBJECT('username', :username))`,
      {
        replacements: { username },
        type: db.QueryTypes.SELECT,
      },
    ); // MySQL
    if (responses && responses.length > 0) {
      for (let response of responses) {
        let resp = JSON.parse(response.response); // only parse with MySQL db (not PostgreSQL)
        resp.username = '[deleted]';
        await Response.update(
          { response: resp },
          { where: { id: response.id } },
        );
      }
    }
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    console.error(err);
  }
}

module.exports = authRouter;
