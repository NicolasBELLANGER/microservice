const { consumeQueue } = require('../services/rabbitmq');

// Consommation de la file "progressUpdated"
consumeQueue('progressUpdated', (message) => {
  console.log('Progrès mis à jour pour l\'utilisateur :', message);
  // Ajouter ici la logique pour traiter l'événement
});
