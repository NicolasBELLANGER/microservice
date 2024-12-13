require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const nutritionRoutes = require('./routes/NutritionRoutes');
const amqp = require('amqplib');
const { promisify } = require('util');
const cors = require('cors');

// Fonction pour tester la connexion à RabbitMQ avec retry
async function waitForRabbitMQ(url, retries = 10, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await amqp.connect(url);
      console.log('✅ RabbitMQ connecté');
      return connection;
    } catch (err) {
      console.error(`❌ Tentative ${attempt} échouée: ${err.message}`);
      if (attempt === retries) {
        console.error('❌ Impossible de se connecter à RabbitMQ après plusieurs tentatives');
        process.exit(1);
      }
      await promisify(setTimeout)(delay);
    }
  }
}


// Initialiser l'application Express
const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger
const swaggerPath = path.join(__dirname, 'swagger', 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/nutrition', nutritionRoutes);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB:', err));

// Attendre que RabbitMQ soit prêt avant de démarrer le consommateur
waitForRabbitMQ(process.env.RABBITMQ_URL).then(() => {
  // Démarrer le consommateur RabbitMQ
  require('./worker/consumer');
}).catch(err => {
  console.error('❌ Erreur critique avec RabbitMQ:', err.message);
  process.exit(1);
});

// Démarrer le serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Nutrition');
});
