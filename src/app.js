const express = require('express');
const cookieParser = require('cookie-parser');

const {
  consumeToken,
  errorHandler,
  missingPath,
  customCors,
} = require('middleware');
const imagesDir = require('lib/images-dir');

const routes = require('./routes');

// express를 이용한 서버 구현
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '30mb' }));
app.use(customCors);

app.use('/images', express.static(imagesDir));

app.use(consumeToken);

app.use('/', routes);
app.use(missingPath);
app.use(errorHandler);

module.exports = app;
