require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./src/config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const programmeRoutes = require('./src/routes/programme-entrainement');
const { connectRabbitMQ, consumeProgressUpdates } = require('./src/config/rabbitmq');

const app = express();
app.use(express.json());

connectToDatabase();

connectRabbitMQ()
  .then(() => {
    console.log('🚀 RabbitMQ connecté');
    consumeProgressUpdates();
  })
  .catch((err) => {
    console.error('❌ Échec de connexion à RabbitMQ :', err);
  });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/programmes', programmeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
