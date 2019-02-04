const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const mongoose = require('mongoose');
const { sendError } = require('../libs/utilities');
const fs = require('fs');
const async = require('async');

// Validator configuration
const validate = require('express-validation');
const validation = require('../validation/index');

// User profile pic upload config
const picUpload = require('../config/picUpload');

// Load User model
const User = require('../models/User');

// Error messages
const errMessages = {};
errMessages.server = 'Server Problem';
errMessages.noUsers = 'There are no users registered yet!';
errMessages.noUser = 'No user found';
errMessages.badCurrentPassword = 'Incorrect current password';
errMessages.usernameExist = 'Username already exist!';
errMessages.emailExist = 'Email already exist!';

// @route  GET users/current
// @desc   Return current logged in user
// @access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      social: req.user.social
    });
  }
);

// @route  GET users/all
// @desc   Return all users
// @access Private
router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.find({}, 'firstName lastName username email avatar social')
      .then(users => {
        if (!users) {
          return sendError(res, 404, errMessages.noUsers);
        }

        res.json({ success: true, users: users });
      })
      .catch(err => {
        sendError(res, 500, errMessages.server, err);
      });
  }
);

// @route  PATCH users/current
// @desc   Update current user
// @access Private
router.patch(
  '/current',
  passport.authenticate('jwt', { session: false }),
  validate(validation.userUpdate),
  (req, res) => {
    const profile = {};
    async.series([
      // Check for existing username
      callback => {
        if (req.body.username !== req.user.username) {
          User.findOne({
            username: req.body.username
          }).then(user => {
            // Username exist
            if (user) {
              sendError(res, 400, errMessages.usernameExist);
              callback(errMessages.usernameExist);
            } else callback();
          });
        } else callback();
      },
      // Check for existing email
      callback => {
        if (req.body.email !== req.user.email) {
          User.findOne({ email: req.body.email }).then(user => {
            // Email exist
            if (user) {
              sendError(res, 400, errMessages.emailExist);
              callback(errMessages.emailExist);
            } else callback();
          });
        } else callback();
      },
      // Changing password
      callback => {
        if (req.body.newPassword && req.body.newConfirmPassword) {
          // Check current password
          bcrypt
            .compare(req.body.currentPassword, req.user.password)
            .then(isMatch => {
              // Password does not match
              if (!isMatch) {
                sendError(res, 400, errMessages.badCurrentPassword);
                callback(errMessages.badCurrentPassword);
              } else {
                // Synchronous password hashing
                profile.password = bcrypt.hashSync(
                  req.body.newPassword,
                  keys.saltFactor
                );
                callback();
              }
            });
        } else callback();
      },
      // Username and email do not exist so upadate the user
      callback => {
        // Required fields
        profile.firstName = req.body.firstName;
        profile.lastName = req.body.lastName;
        profile.username = req.body.username;
        profile.email = req.body.email;

        // Optional fields
        if (req.body.avatar) profile.avatar = req.body.avatar;

        // Social
        profile.social = {};
        if (req.body.linkedin) profile.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profile.social.instagram = req.body.instagram;
        if (req.body.telegram) profile.social.telegram = req.body.telegram;
        if (req.body.github) profile.social.github = req.body.github;

        // Update user
        User.findByIdAndUpdate(req.user.id, { $set: profile }, { new: true })
          .then(user => {
            res.json(user);
            callback();
          })
          .catch(err => {
            sendError(res, 500, errMessages.server, err);
            callback();
          });
      }
    ]);
  }
);

// @route  POST users/uploadpic
// @desc   Upload user profile picture
// @access Private
router.post(
  '/uploadpic',
  passport.authenticate('jwt', { session: false }),
  picUpload,
  (req, res) => {
    if (!req.file) {
      return res.status(422).json({ success: false });
    } else {
      const profile = {};
      profile.avatar = req.file.filename;

      // Deleting previous user photo if exist
      if (req.user.avatar !== '') {
        fs.unlink(`profilePics/${req.user.avatar}`, err => {
          if (err) console.log(err);
        });
      }

      // Update user avatar
      User.findByIdAndUpdate(req.user.id, { $set: profile }, { new: true })
        .then(() => {
          console.log('then');
          res.json({ success: true });
        })
        .catch(err => {
          console.log(err);
          sendError(res, 500, errMessages.server, err);
        });
    }
  }
);

module.exports = router;
