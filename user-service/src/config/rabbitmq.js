const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connecté à RabbitMQ');
    return channel;
  } catch (error) {
    console.error('❌ Erreur de connexion à RabbitMQ:', error.message);
    console.log('🔄 Nouvelle tentative de connexion à RabbitMQ dans 5 secondes...');
    setTimeout(connectRabbitMQ, 5000); // Retenter la connexion après 5 secondes
  }
}

function getChannel() {
  if (!channel) throw new Error('❌ Canal RabbitMQ non initialisé.');
  return channel;
}

module.exports = {
  connectRabbitMQ,
  getChannel,
};
