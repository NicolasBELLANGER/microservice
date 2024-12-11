const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Inscription
router.post('/register', userController.register);

// Connexion
router.post('/login', userController.login);

// Déconnexion
router.post('/logout', userController.logout);

// Récupérer les détails de l'utilisateur
router.get('/details', authMiddleware, userController.getDetails);

// Mettre à jour les progressions
router.put('/progress', authMiddleware, userController.updateProgress);

// Mettre à jour l'abonnement
router.put('/subscription', authMiddleware, userController.updateSubscription);

// Déconnexion
router.post('/logout', userController.logout);

module.exports = router;
