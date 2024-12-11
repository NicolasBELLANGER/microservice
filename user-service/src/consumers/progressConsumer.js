const { getChannel } = require('../config/rabbitmq');

async function consumeProgressUpdates() {
  const channel = getChannel();
  channel.assertQueue('progressUpdates', { durable: true });

  channel.consume('progressUpdates', (msg) => {
    const event = JSON.parse(msg.content.toString());
    console.log('Message reçu :', event);

    // Traiter l'événement ici
    channel.ack(msg);
  });

  console.log('Consommateur progressUpdates démarré.');
}

async function consumeProgrammeUpdates() {
  try {
    const channel = getChannel();
    await channel.assertQueue('programmeUpdates', { durable: true });

    console.log('Consommateur de programmeUpdates démarré.');

    channel.consume('programmeUpdates', (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString());
      console.log('Message reçu :', event);

      // Votre logique ici
      if (event.event === 'ProgrammeCreated') {
        console.log('Programme créé :', event.programme);
      } else if (event.event === 'ProgrammeUpdated') {
        console.log('Programme mis à jour :', event.programme);
      } else if (event.event === 'ProgrammeDeleted') {
        console.log('Programme supprimé avec ID :', event.programmeId);
      }

      channel.ack(msg);
    });
  } catch (error) {
    console.error('Erreur dans consumeProgrammeUpdates :', error.message);
  }
}
module.exports = {
  consumeProgressUpdates,
  consumeProgrammeUpdates,
};
