/**
 * @swagger
 * /programmes:
 *   get:
 *     summary: Obtenir tous les programmes d'entraînement
 *     tags:
 *       - ProgrammeEntrainement
 *     responses:
 *       200:
 *         description: Liste des programmes d'entraînement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeEntrainement'
 *             example:
 *               - id: "639d0b9c1e74a8123456789a"
 *                 name: "Programme Musculation"
 *                 description: "Un programme pour augmenter la masse musculaire."
 *                 exercises: [
 *                   { name: "Pompes", repetitions: 15, sets: 3 },
 *                   { name: "Squats", repetitions: 20, sets: 3 }
 *                 ]
 *               - id: "639d0b9c1e74a8123456789b"
 *                 name: "Programme Endurance"
 *                 description: "Un programme pour améliorer la capacité cardiorespiratoire."
 *                 exercises: [
 *                   { name: "Course", repetitions: 600, sets: 1 },
 *                   { name: "Corde à sauter", repetitions: 100, sets: 3 }
 *                 ]
 */

/**
 * @swagger
 * /programmes/{id}:
 *   get:
 *     summary: Obtenir un programme d'entraînement par ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme d'entraînement
 *     responses:
 *       200:
 *         description: Détails du programme d'entraînement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgrammeEntrainement'
 *             example:
 *               id: "639d0b9c1e74a8123456789a"
 *               name: "Programme Musculation"
 *               description: "Un programme pour augmenter la masse musculaire."
 *               exercises: [
 *                 { name: "Pompes", repetitions: 15, sets: 3 },
 *                 { name: "Squats", repetitions: 20, sets: 3 }
 *               ]
 *       404:
 *         description: Programme non trouvé
 */

/**
 * @swagger
 * /programmes:
 *   post:
 *     summary: Créer un nouveau programme d'entraînement
 *     tags:
 *       - ProgrammeEntrainement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgrammeEntrainement'
 *           example:
 *             name: "Programme Yoga"
 *             description: "Un programme pour améliorer la souplesse et la relaxation."
 *             exercises: [
 *               { name: "Posture du chien", repetitions: 10, sets: 3 },
 *               { name: "Posture de l'arbre", repetitions: 10, sets: 2 }
 *             ]
 *     responses:
 *       201:
 *         description: Programme d'entraînement créé avec succès
 *       400:
 *         description: Données d'entrée invalides
 */

/**
 * @swagger
 * /programmes/{id}:
 *   put:
 *     summary: Mettre à jour un programme d'entraînement par ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme d'entraînement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgrammeEntrainement'
 *           example:
 *             name: "Programme Cardio"
 *             description: "Un programme pour améliorer l'endurance."
 *             exercises: [
 *               { name: "Course rapide", repetitions: 500, sets: 3 },
 *               { name: "Montées de genoux", repetitions: 20, sets: 4 }
 *             ]
 *     responses:
 *       200:
 *         description: Programme d'entraînement mis à jour avec succès
 *       400:
 *         description: Données d'entrée invalides
 *       404:
 *         description: Programme non trouvé
 */

/**
 * @swagger
 * /programmes/{id}:
 *   delete:
 *     summary: Supprimer un programme d'entraînement par ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme d'entraînement
 *     responses:
 *       200:
 *         description: Programme supprimé avec succès
 *       404:
 *         description: Programme non trouvé
 */

/**
 * @swagger
 * /programmes/generate:
 *   post:
 *     summary: Générer un plan d'entraînement
 *     tags:
 *       - ProgrammeEntrainement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal:
 *                 type: string
 *                 description: Objectif de l'entraînement (ex : Perte de poids, Musculation, Endurance)
 *               createdBy:
 *                 type: string
 *                 description: Utilisateur ayant créé le plan
 *           example:
 *             goal: "Musculation"
 *             createdBy: "user123"
 *     responses:
 *       201:
 *         description: Plan d'entraînement généré avec succès
 *       400:
 *         description: Objectif invalide
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /programmes/complete:
 *   put:
 *     summary: Marquer un exercice comme complété
 *     tags:
 *       - ProgrammeEntrainement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               programmeId:
 *                 type: string
 *                 description: ID du programme d'entraînement
 *               exerciseName:
 *                 type: string
 *                 description: Nom de l'exercice à marquer comme complété
 *           example:
 *             programmeId: "639d0b9c1e74a8123456789a"
 *             exerciseName: "Pompes"
 *     responses:
 *       200:
 *         description: Exercice marqué comme complété
 *       404:
 *         description: Programme ou exercice non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /programmes/user:
 *   get:
 *     summary: Obtenir tous les programmes d'entraînement pour l'utilisateur authentifié
 *     tags:
 *       - ProgrammeEntrainement
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des programmes pour l'utilisateur authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeEntrainement'
 *             example:
 *               - id: "639d0b9c1e74a8123456789a"
 *                 name: "Programme Musculation"
 *                 description: "Un programme pour augmenter la masse musculaire."
 *                 exercises: [
 *                   { name: "Pompes", repetitions: 15, sets: 3 },
 *                   { name: "Squats", repetitions: 20, sets: 3 }
 *                 ]
 *       401:
 *         description: Accès non autorisé, jeton manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès non autorisé"
 *       404:
 *         description: Aucun programme trouvé pour cet utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Aucun programme trouvé pour cet utilisateur"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
