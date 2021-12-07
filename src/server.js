require('env');
const app = require('app');
const getConnection = require('database/get-connection');
const { associate } = require('database/sync');

const { PORT } = process.env;
if (!PORT) {
  throw new Error('MISSING_ENVAR');
}

getConnection();
associate();

// 서버 동작
const server = app.listen(PORT, () => {
  console.log(`Server is running, port number is ${PORT} `);
});

module.exports = server;
