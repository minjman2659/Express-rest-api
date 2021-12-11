const jwt = require('jsonwebtoken');

const { SECRET_KEY, CLIENT_HOST, API_HOST } = process.env;

// if (!SECRET_KEY || !CLIENT_HOST || !API_HOST) {
//   throw new Error('MISSING_ENVAR');
// }

const IS_DEV = process.env.NODE_ENV !== 'production';

const generateToken = (payload, options) => {
  const jwtOptions = {
    issuer: API_HOST,
    expiresIn: '30d',
    ...options,
  };

  if (!jwtOptions.expiresIn) {
    // removes expiresIn when expiresIn is given as undefined
    delete jwtOptions.expiresIn;
  }
  const userData = { ...payload.user.dataValues };
  delete userData.password;
  return new Promise((resolve, reject) => {
    jwt.sign(userData, SECRET_KEY, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const decodeToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

const setTokenCookie = (res, tokens) => {
  const { accessToken, refreshToken } = tokens;

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 1000 * 60 * 60 * 1, // 1hour
    secure: !IS_DEV,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    domain: !IS_DEV ? CLIENT_HOST : undefined,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30day
    secure: !IS_DEV,
  });
};

module.exports = {
  generateToken,
  decodeToken,
  setTokenCookie,
};
