// routes/gymRoutes.js
const express = require('express');
const { searchGyms, getGymById, getFavorites, addToFavorites, addGym } = require('../controllers/gymController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/gyms/search:
 *   get:
 *     summary: Rechercher des salles de sport
 *     description: Recherche des salles de sport en fonction du nom
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         type: string
 *         description: Le terme de recherche
 *       - in: query
 *         name: limit
 *         required: false
 *         type: integer
 *         description: Limite du nombre de résultats
 *       - in: query
 *         name: page
 *         required: false
 *         type: integer
 *         description: Numéro de la page pour la pagination
 *     responses:
 *       200:
 *         description: Liste des salles de sport correspondant à la recherche
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/search', searchGyms);

/**
 * @swagger
 * /api/gyms/{gymId}:
 *   get:
 *     summary: Obtenir les détails d'une salle de sport
 *     description: Obtenez les informations détaillées sur une salle de sport en fonction de son ID
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         type: string
 *         description: L'ID de la salle de sport
 *     responses:
 *       200:
 *         description: Détails de la salle de sport
 *       404:
 *         description: Salle de sport non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:gymId', getGymById);

/**
 * @swagger
 * /api/gyms/favorites:
 *   get:
 *     summary: Obtenir les favoris d'un utilisateur
 *     description: Récupérer la liste des salles de sport ajoutées aux favoris par l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Liste des salles de sport favorites
 *       401:
 *         description: Utilisateur non autorisé (manque le token)
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/favorites', protect, getFavorites);

/**
 * @swagger
 * /api/gyms/favorites:
 *   post:
 *     summary: Ajouter une salle de sport aux favoris
 *     description: Ajoutez une salle de sport à la liste des favoris de l'utilisateur connecté
 *     parameters:
 *       - in: body
 *         name: gymId
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             gymId:
 *               type: string
 *               description: L'ID de la salle à ajouter aux favoris
 *     responses:
 *       201:
 *         description: Salle de sport ajoutée aux favoris
 *       400:
 *         description: La salle est déjà dans les favoris
 *       401:
 *         description: Utilisateur non autorisé (manque le token)
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/favorites', protect, addToFavorites);

/**
 * @swagger
 * /api/gyms:
 *   post:
 *     tags:
 *       - Salles de sport
 *     summary: Ajouter une salle de sport
 *     description: Permet d'ajouter une nouvelle salle de sport à la base de données.
 *     requestBody:
 *       description: Détails de la salle de sport à ajouter
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la salle de sport
 *               location:
 *                 type: string
 *                 description: Adresse de la salle de sport
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des équipements de la salle
 *               details:
 *                 type: string
 *                 description: Informations supplémentaires sur la salle
 *               openingHours:
 *                 type: string
 *                 description: Horaires d'ouverture de la salle
 *               pricing:
 *                 type: string
 *                 description: Informations sur les tarifs de la salle
 *             required:
 *               - name
 *               - location
 *               - facilities
 *               - details
 *               - openingHours
 *               - pricing
 *     responses:
 *       201:
 *         description: Salle de sport ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', addGym);


module.exports = router;
