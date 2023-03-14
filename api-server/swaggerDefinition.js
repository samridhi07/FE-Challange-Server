const swaggerDefinition = {
  openapi: '3.0.0',

  info: {
    title: 'FE Task API',
    version: '1.0.0',
    description: 'Task API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

module.exports = swaggerDefinition;
