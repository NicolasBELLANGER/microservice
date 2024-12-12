const Gym = require('../models/Gym');
const User = require('../models/User');
const { sendToQueue } = require('../services/rabbitmq');

// Récupérer toutes les salles de sport
exports.getGyms = async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.status(200).json(gyms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gyms' });
  }
};

// Obtenir les détails d'une salle
exports.getGymById = async (req, res) => {
  const { gymId } = req.params;
  try {
    const gym = await Gym.findById(gymId);
    if (!gym) return res.status(404).json({ error: 'Gym not found' });
    res.status(200).json(gym);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gym details' });
  }
};

// Ajouter une nouvelle salle de sport
exports.addGym = async (req, res) => {
  const { name, location, facilities, details, openingHours, pricing } = req.body;

  if (!name || !location || !facilities || facilities.length === 0) {
    return res.status(400).json({ error: 'Missing required fields: name, location, facilities' });
  }

  try {
    const newGym = new Gym({
      name,
      location,
      facilities,
      details,
      openingHours,
      pricing
    });

    const savedGym = await newGym.save();

    const gymData = { gymId: savedGym._id, name, location, timestamp: new Date() };
    await sendToQueue('newGymAdded', gymData);

    res.status(201).json({
      message: 'Gym added successfully',
      gym: savedGym,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding gym' });
  }
};

// Obtenir les favoris d'un utilisateur
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorite gyms' });
  }
};

// Ajouter une salle aux favoris
exports.addToFavorites = async (req, res) => {
  const { gymId } = req.body;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.favorites.includes(gymId)) {
      return res.status(400).json({ message: 'Gym already in favorites' });
    }
    user.favorites.push(gymId);
    await user.save();

    const favoriteData = { userId, gymId, timestamp: new Date() };
    await sendToQueue('gymAddedToFavorites', favoriteData);

    res.status(201).json({ message: 'Gym added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding gym to favorites' });
  }
};
