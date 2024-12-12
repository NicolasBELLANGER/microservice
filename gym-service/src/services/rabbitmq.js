const amqp = require('amqplib');

let connection;
let channel;

// Connexion à RabbitMQ
async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
  }
  return channel;
}

// Envoyer un message à une file RabbitMQ
async function sendToQueue(queueName, message) {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
}

// Consommer des messages à partir d'une file RabbitMQ
async function consumeQueue(queueName, callback) {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content); // Traitement du message
      channel.ack(msg); // Confirmation du message consommé
    }
  });
}

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue };
