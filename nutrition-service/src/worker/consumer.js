const { consumeQueue } = require('../config/rambitmq');

consumeQueue('progressUpdated', (message) => {
  console.log('Progrès mis à jour pour l\'utilisateur :', message);
});
