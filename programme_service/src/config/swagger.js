const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Programme Entrainement API',
      version: '1.0.0',
      description: 'API for managing training programs and workouts',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/docs/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
