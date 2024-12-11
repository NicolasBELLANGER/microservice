const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connecté à RabbitMQ');
  } catch (error) {
    console.error('❌ Erreur de connexion à RabbitMQ:', error.message);
    process.exit(1);
  }
}

async function publishToQueue(queue, message) {
  if (!channel) {
    console.error('❌ RabbitMQ non connecté.');
    return;
  }
  try {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`📤 Message envoyé à la queue "${queue}": ${message}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi du message à la queue "${queue}":`, error.message);
  }
}

async function consumeProgressUpdates() {
  try {
    const channel = getChannel();
    await channel.assertQueue('progressUpdates', { durable: true });

    console.log('✅ Consommateur progressUpdates démarré.');

    channel.consume('progressUpdates', (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log('Message reçu :', event);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erreur dans consumeProgressUpdates :', error.message);
  }
}

module.exports = {
  connectRabbitMQ,
  publishToQueue,
  consumeProgressUpdates,
};
