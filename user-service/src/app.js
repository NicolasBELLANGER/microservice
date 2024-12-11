require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { consumeProgrammeUpdates, consumeProgressUpdates } = require('./consumers/progressConsumer');

const app = express();

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// Connexion à RabbitMQ
(async () => {
  await connectRabbitMQ();
  consumeProgrammeUpdates();
  consumeProgressUpdates(); // Démarrer le consommateur RabbitMQ
})();

// Routes utilisateur
app.use('/users', userRoutes);

// Swagger Documentation
const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
