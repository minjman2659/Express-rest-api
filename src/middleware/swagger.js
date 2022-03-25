const swaggerJsDoc = require('swagger-jsdoc');

const { API_HOST } = process.env;

if (!API_HOST) {
  throw new Error('NO_ENV!!');
}

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express-rest-api Docs',
      version: '1.0.0',
      description: 'Express-rest-api Docs',
    },
    servers: [
      {
        url: `${API_HOST}/api/v1`,
      },
    ],
  },
  apis: ['./**/*.yaml'],
};

const specs = swaggerJsDoc(options);

module.exports = specs;
