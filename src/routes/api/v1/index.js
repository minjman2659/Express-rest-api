const express = require('express');

const swaggerUi = require('swagger-ui-express');
const mode = require('lib/mode');
const specs = require('middleware/swagger');

const v1 = express.Router();

const auth = require('./auth');
const posts = require('./posts');
const files = require('./files');

if (!mode.prod()) {
  v1.use(
    '/docs',
    swaggerUi.serveFiles(specs),
    swaggerUi.setup(specs, { explorer: true }),
  );
}

v1.use('/auth', auth);
v1.use('/posts', posts);
v1.use('/files', files);

module.exports = v1;
