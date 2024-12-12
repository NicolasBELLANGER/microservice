// routes/gymRoutes.js
const express = require('express');
const { getGyms, getGymById, getFavorites, addToFavorites, addGym } = require('../controllers/gymController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Route pour rechercher des salles de sport
router.get('/', getGyms);

// Route pour obtenir les détails d'une salle de sport par son ID
router.get('/:gymId', getGymById);

// Route pour obtenir les favoris d'un utilisateur connecté
router.get('/favorites', protect, getFavorites);

// Route pour ajouter une salle de sport aux favoris de l'utilisateur connecté
router.post('/favorites', protect, addToFavorites);

// Route pour ajouter une nouvelle salle de sport
router.post('/', addGym);

module.exports = router;
