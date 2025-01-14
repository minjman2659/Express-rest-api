require('env');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  dev: () => isDev,
  prod: () => !isDev,
};
