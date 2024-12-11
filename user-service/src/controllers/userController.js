const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getChannel } = require('../config/rabbitmq');

// Inscription utilisateur
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', `Bearer ${token}`).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Déconnexion utilisateur
exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Utilisateur déconnecté avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
  }
};

// Récupérer les détails de l'utilisateur
exports.getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour les progressions
exports.updateProgress = async (req, res) => {
  const { weight, height, bodyFatPercentage } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    user.progress = {
      weight,
      height,
      bodyFatPercentage,
      updatedAt: new Date(),
    };
    await user.save();

    // Connexion à RabbitMQ
    const channel = getChannel();
    await channel.assertQueue('progressUpdates', { durable: true });

    // Publier l'événement
    const event = {
      event: 'progressUpdated',
      userId: user._id,
      progress: user.progress,
      updatedAt: new Date(),
    };
    channel.sendToQueue('progressUpdates', Buffer.from(JSON.stringify(event)));
    console.log('Événement progressUpdated publié :', event);

    res.json({ message: 'Progressions mises à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour l'abonnement
exports.updateSubscription = async (req, res) => {
  const { subscription } = req.body;

  if (!['free', 'premium'].includes(subscription)) {
    return res.status(400).json({ message: 'Type d\'abonnement invalide.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    user.subscription = subscription;
    await user.save();

    res.json({ message: 'Abonnement mis à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
