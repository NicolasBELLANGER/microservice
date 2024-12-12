require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const gymRoutes = require('./routes/gymRoutes');
const amqp = require('amqplib');
const { promisify } = require('util');

// Fonction pour tester la connexion à RabbitMQ avec retry
async function waitForRabbitMQ(url, retries = 10, delay = 3000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await amqp.connect(url);
      console.log('RabbitMQ connected');
      return;
    } catch (err) {
      attempt++;
      console.error(`RabbitMQ connection attempt ${attempt} failed:`, err.message);
      if (attempt >= retries) {
        throw new Error('Could not connect to RabbitMQ after multiple attempts');
      }
      await promisify(setTimeout)(delay); // Attend un peu avant de réessayer
    }
  }
}

// Initialiser l'application Express
const app = express();
app.use(bodyParser.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/gyms', gymRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Attendre que RabbitMQ soit prêt avant de démarrer le consommateur
waitForRabbitMQ(process.env.RABBITMQ_URL).then(() => {
  // Démarrer le consommateur RabbitMQ
  require('./worker/consumer');
}).catch(err => {
  console.error('Error starting consumer:', err.message);
  process.exit(1);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Route racine
app.get('/', (req, res) => {
  res.send('Hello World');
});
