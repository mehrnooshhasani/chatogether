const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

exports.signJWT = (res, payload) => {
    jwt.sign(payload, keys.secretOrKey, keys.jwtExpires, (err, token) => {
        const accessToken = 'Bearer ' + token;
        res.cookie('accessToken', accessToken, keys.cookieOptions).json(
            accessToken
        );
    });
};

exports.socialJWTsign = (res, payload) => {
    jwt.sign(payload, keys.secretOrKey, keys.jwtExpires, (err, token) => {
        const accessToken = 'Bearer ' + token;
        res.cookie('accessToken', accessToken, keys.cookieOptions).redirect(
            '/'
        );
    });
};

exports.randomString = () => {
    const length = 10;
    return Math.round(
        Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
    )
        .toString(36)
        .slice(1);
};

exports.sendError = (res, status, message, err) => {
    const errors = {};
    errors.message = message;

    if (err) console.log(err);
    res.status(status).json(errors);
};
