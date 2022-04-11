const consumeToken = require('./consume-token');
const needsAuth = require('./needs-auth');
const errorHandler = require('./error-handler');
const missingPath = require('./missing-path');
const multerStorage = require('./multer-storage');
const customCors = require('./custom-cors');

module.exports = {
  consumeToken,
  needsAuth,
  errorHandler,
  missingPath,
  multerStorage,
  customCors,
};
