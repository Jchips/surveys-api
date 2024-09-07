'use strict';

const express = require('express');
const { User } = require('./models');
const acl = require('./middleware/acl');
const basicAuth = require('./middleware/basic');
const bearerAuth = require('./middleware/bearer');

const authRouter = express.Router();

// ------ Routes -----

authRouter.post('/signup', signup);
authRouter.post('/signin', basicAuth, signin);
authRouter.get('/users', bearerAuth, acl('deleteUser'), handleViewUsers);
// authRouter.patch('/users/:username', bearerAuth, acl('read'), handleUpdateResps);
authRouter.delete('/delete/:id', bearerAuth, acl('deleteUser'), handleDeleteUser);

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
  // console.log('here'); // delete later
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
    const usernames = allUsers.map(user => ({ id: user.id, username: user.username }));
    res.status(200).json(usernames);
  } catch (err) {
    next(err);
  }
}


// Update responded surveys
// async function handleUpdateResps(req, res, next) {
//   let { username } = req.params;
//   let newResponse = req.body;
//   try {
//     let user = await User.findOne({ where: { username } });
//     user.surveyResps = [...user.surveyResps, newResponse];
//     await user.save();
//     // let edits = await User.update({ surveyResps: [...user.surveyResps, newResponse] }, { where: { username } });
//     res.status(200).json(user);
//   } catch (err) {
//     next(err);
//   }
// }

// Delete a user
async function handleDeleteUser(req, res, next) {
  let { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.status(200).send('user deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = authRouter;
