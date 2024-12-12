const { connectRabbitMQ } = require('../config/rabbitmq');

async function sendProgressUpdate(progressData) {
    const channel = await connectRabbitMQ();
    channel.sendToQueue('progressUpdated', Buffer.from(JSON.stringify(progressData)));
}

module.exports = { sendProgressUpdate };
