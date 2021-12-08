const { nanoid } = require('nanoid');
const crypto = require('crypto');

const { User } = require('database/models');
const { randomEmail } = require('test/helper');

const { PASSWORD_SALT } = process.env;

function hash(password) {
  return crypto
    .createHmac('sha512', PASSWORD_SALT)
    .update(password)
    .digest('hex');
}

const makeRaw = (text = '') => {
  const payload = {
    email: `${randomEmail()}`,
    username: `${nanoid(5)}`,
    password: 'password',
  };

  const buildPayload = {
    email: `${randomEmail()}`,
    username: `${nanoid(5)}_${text}`,
    password: hash(payload.password),
  };

  return { payload, buildPayload };
};

const mockUser = async () => {
  try {
    const { payload, buildPayload } = makeRaw();

    const user = await User.build(buildPayload).save();

    return { user, payload, buildPayload };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mockUser;
