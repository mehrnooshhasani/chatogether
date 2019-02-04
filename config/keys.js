const secretOrKey = 'secret';

const googleClientID =
  '578382244029-6sd0fdtkagn1bo3d3mov1u5mlu2atpme.apps.googleusercontent.com';
const googleClientSecret = 'rhrFi7a3KqSbNvfM5QQy-P9L';
const googleCallbackURL = 'https://chatogether.herokuapp.com/auth/google';

const githubClientID = '0c38e585e37d3597f40e';
const githubClientSecret = '57ab6c31adcdb4cd98c8c2e2c980a521c7c2b8a4';
const githubCallbackURL = 'https://chatogether.herokuapp.com/auth/github';

const linkedinClientID = '779qb7qicdoo2r';
const linkedinClientSecret = '8ROZBfsd4AP1eXQF';
const linkedinCallbackURL = 'https://chatogether.herokuapp.com/auth/linkedin';

module.exports = {
  secretOrKey: secretOrKey,
  saltFactor: 10,
  jwtExpires: { expiresIn: 3600 },
  cookieOptions: {
    expires: new Date(Date.now() + 3600000)
  },
  googleAuth: {
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: googleCallbackURL
  },
  githubAuth: {
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackURL,
    scope: ['user:email'] // Fetch private emails
  },
  linkedinAuth: {
    clientID: linkedinClientID,
    clientSecret: linkedinClientSecret,
    callbackURL: linkedinCallbackURL,
    scope: ['r_emailaddress', 'r_basicprofile']
  }
};
