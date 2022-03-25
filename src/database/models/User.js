const crypto = require('crypto');
const _ = require('lodash');
const Sequelize = require('sequelize');
const db = require('database/db');
const { generateToken } = require('lib/token');

const { PASSWORD_SALT } = process.env;

if (!PASSWORD_SALT) {
  throw new Error('MISSING_ENVAR');
}

function hash(password) {
  return crypto
    .createHmac('sha512', PASSWORD_SALT)
    .update(password)
    .digest('hex');
}

const User = db.define(
  'User',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE },
  },
  {
    indexes: [
      {
        fields: ['username', 'email'],
      },
    ],
    defaultScope: {
      attributes: { exclude: ['password'] }, // Password column removed default when user was selected
    },
  },
);

User.associate = models => {
  User.hasMany(models.Post, {
    foreignKey: 'userId',
    as: 'posts',
  });
};

// classMethods
User.register = async function register({
  username,
  email,
  password,
  transaction,
}) {
  try {
    const user = await this.create(
      {
        username,
        email,
        password: hash(password),
      },
      { transaction },
    );

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

// instanceMehtods
User.prototype.generateUserToken = async function generateUserToken() {
  const refreshToken = await generateToken(
    {
      user: this,
    },
    {
      subject: 'refresh_token',
      expiresIn: '30d',
    },
  );

  const accessToken = await generateToken(
    {
      user: this,
    },
    {
      subject: 'access_token',
      expiresIn: '1h',
    },
  );

  return {
    refreshToken,
    accessToken,
  };
};

User.prototype.refreshUserToken = async function refreshUserToken(
  refreshTokenExp,
  originalRefreshToken,
) {
  const now = new Date().getTime();
  const diff = refreshTokenExp * 1000 - now;
  let refreshToken = originalRefreshToken;

  // 15일 이하인 경우
  if (diff < 1000 * 60 * 60 * 24 * 15) {
    refreshToken = await generateToken(
      {
        user: this,
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d',
      },
    );
  }
  const accessToken = await generateToken(
    {
      user: this,
    },
    {
      subject: 'access_token',
      expiresIn: '1h',
    },
  );

  return { refreshToken, accessToken };
};

User.prototype.validatePassword = function validatePassword(password) {
  const hashed = hash(password);
  if (!this.password) {
    throw new Error('password column is required');
  }
  return this.password === hashed;
};

User.prototype.toRes = function toRes() {
  const user = _.chain(this.toJSON()).omit(['password']).value();
  return user;
};

module.exports = User;
