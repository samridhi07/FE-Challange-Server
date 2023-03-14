const swaggerDefinition = require('./swaggerDefinition');

const options = {
  swaggerDefinition,
    apis: ['./Routes/tasks.js'],
  
};

module.exports = options;
