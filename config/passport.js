const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GithubStrategy = require('passport-github').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

const User = require('../models/User');
const keys = require('../config/keys');
const { randomString } = require('../libs/utilities');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  // JWT strategy
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => {
          console.log(err);
          return done(null, false);
        });
    })
  );

  // Google strategy
  passport.use(
    new GoogleStrategy(
      keys.googleAuth,
      (token, refreshToken, profile, done) => {
        // Make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const email = profile.emails[0].value; // Pull the first email
          const username = email;
          const avatar = profile.photos[0].value;
          const password = randomString();

          User.findOne({ email: email })
            .then(user => {
              // User found
              if (user) {
                return done(null, user);
              }

              // User not found so register the user
              const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                avatar: avatar,
                password: password
              });

              newUser
                .save()
                .then(user => done(null, user))
                .catch(err => {
                  console.log(err);
                  return done(null, false);
                });
            })
            .catch(err => {
              console.log(err);
              return done(null, false);
            });
        });
      }
    )
  );

  // Github strategy
  passport.use(
    new GithubStrategy(
      keys.githubAuth,
      (token, refreshToken, profile, done) => {
        // Make the code asynchronous
        // User.findOne won't fire until we have all our data back from Github
        process.nextTick(() => {
          const firstName = profile.displayName
            .split(' ')
            .slice(0, -1)
            .join(' ');
          const lastName = profile.displayName
            .split(' ')
            .slice(-1)
            .join(' ');
          const email = profile.emails[0].value; // Pull the first email
          const username = email;
          const avatar = profile.photos[0].value;
          const social = {
            github: profile.username
          };
          const password = randomString();

          User.findOne({ email: email })
            .then(user => {
              // User found
              if (user) {
                return done(null, user);
              }

              // User not found so register the user
              const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                avatar: avatar,
                social: social,
                password: password
              });

              newUser
                .save()
                .then(user => done(null, user))
                .catch(err => {
                  console.log(err);
                  return done(null, false);
                });
            })
            .catch(err => {
              console.log(err);
              return done(null, false);
            });
        });
      }
    )
  );

  // Linkedin strategy
  passport.use(
    new LinkedinStrategy(
      keys.linkedinAuth,
      (token, refreshToken, profile, done) => {
        // Make the code asynchronous
        // User.findOne won't fire until we have all our data back from Linkedin
        process.nextTick(() => {
          const firstName = profile.name.givenName;
          const lastName = profile.name.familyName;
          const email = profile.emails[0].value; // Pull the first email
          const username = email;
          const avatar = profile.photos[0].value;
          const social = {
            linkedin: profile._json.publicProfileUrl
          };
          const password = randomString();

          User.findOne({ email: email })
            .then(user => {
              // User found
              if (user) {
                return done(null, user);
              }

              // User not found so register the user
              const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                avatar: avatar,
                social: social,
                password: password
              });

              newUser
                .save()
                .then(user => done(null, user))
                .catch(err => {
                  console.log(err);
                  return done(null, false);
                });
            })
            .catch(err => {
              console.log(err);
              return done(null, false);
            });
        });
      }
    )
  );
};
