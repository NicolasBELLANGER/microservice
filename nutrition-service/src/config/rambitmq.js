const amqp = require('amqplib');

let connection;
let channel;

// Connexion à RabbitMQ
async function connectRabbitMQ() {
  if (!connection) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log('✅ RabbitMQ connecté');
    } catch (error) {
      console.error('❌ Erreur de connexion à RabbitMQ:', error.message);
      throw error;
    }
  }
  return channel;
}

// Envoyer un message à une file RabbitMQ
async function sendToQueue(queueName, message) {
  try {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`📤 Message envoyé à RabbitMQ (${queueName}):`, message);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi à RabbitMQ:', error.message);
  }
}

// Consommer des messages à partir d'une file RabbitMQ
async function consumeQueue(queueName, callback) {
  try {
    const channel = await connectRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
    console.log(`📥 Consommation activée sur la file ${queueName}`);
  } catch (error) {
    console.error('❌ Erreur lors de la consommation de RabbitMQ:', error.message);
  }
}

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue };
