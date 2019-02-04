const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const passport = require('passport');
const { signJWT, socialJWTsign, sendError } = require('../libs/utilities');

// Validator configuration
const validate = require('express-validation');
const validation = require('../validation/index');

// Load User model
const User = require('../models/User');

// Error messages
const errMessages = {};
errMessages.server = 'Server Problem';
errMessages.usernameExist = 'Username already exist!';
errMessages.emailExist = 'Email already exist!';
errMessages.noUser = 'User not found';
errMessages.badPassword = 'Incorrect password';

// @route  POST auth/register
// @desc   Register user
// @access Public
router.post('/register', validate(validation.register), (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Search for existing user
  User.find()
    .or([{ username: username }, { email: email }])
    .then(users => {
      // User exist
      if (users.length !== 0) {
        for (let user of users) {
          if (user.username === username)
            return sendError(res, 400, errMessages.usernameExist);

          if (user.email === email)
            return sendError(res, 400, errMessages.emailExist);
        }
      }

      // Registering user //

      // Creating new user
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password
      });

      // Hashing password
      bcrypt
        .hash(password, keys.saltFactor)
        .then(hash => {
          newUser.password = hash;

          // Saving user in database
          newUser
            .save()
            .then(() => {
              res.json({ message: 'success' });
            })
            .catch(err => {
              sendError(res, 500, errMessages.server, err);
            });
        })
        .catch(err => {
          sendError(res, 500, errMessages.server, err);
        });
    })
    .catch(err => {
      sendError(res, 500, errMessages.server, err);
    });
});

// @route  POST auth/login
// @desc   Login user
// @access Public
router.post('/login', validate(validation.login), (req, res) => {
  const emailOrUsername = req.body.emailOrUsername;
  const password = req.body.password;

  // Find user by email or username
  User.findOne()
    .or([{ username: emailOrUsername }, { email: emailOrUsername }])
    .then(user => {
      if (!user) {
        return sendError(res, 404, errMessages.noUser);
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        // Password does not match
        if (!isMatch) {
          return sendError(res, 400, errMessages.badPassword);
        }

        // User matched //

        // Create JWT payload
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatar: user.avatar
        };

        // Sign token
        signJWT(res, payload);
      });
    })
    .catch(err => {
      sendError(res, 500, errMessages.server, err);
    });
});

// GOOGLE OAUTH2 //

// @route  GET auth/google
// @desc   Redirect to google for authentication
// @access Public
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  }),
  (req, res) => {
    // Create JWT payload
    const payload = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      avatar: req.user.avatar
    };

    // Sign token
    socialJWTsign(res, payload);
  }
);

// GITHUB OAUTH2 //

// @route  GET auth/github
// @desc   Redirect to gihub for authentication
// @access Public
router.get(
  '/github',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    // Create JWT payload
    const payload = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      avatar: req.user.avatar
    };

    // Sign token
    socialJWTsign(res, payload);
  }
);

// LINKEDIN OAUTH2 //

// @route  GET auth/linkedin
// @desc   Redirect to linkedin for authentication
// @access Public
router.get(
  '/linkedin',
  passport.authenticate('linkedin', { session: false }),
  (req, res) => {
    // Create JWT payload
    const payload = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      avatar: req.user.avatar
    };

    // Sign token
    socialJWTsign(res, payload);
  }
);

module.exports = router;
