/**
 * @swagger
 * /programmes:
 *   get:
 *     summary: Get all training programs
 *     tags:
 *       - ProgrammeEntrainement
 *     responses:
 *       200:
 *         description: List of training programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeEntrainement'
 */

/**
 * @swagger
 * /programmes/{id}:
 *   get:
 *     summary: Get a training program by ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training program
 *     responses:
 *       200:
 *         description: Training program details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgrammeEntrainement'
 *       404:
 *         description: Training program not found
 */

/**
 * @swagger
 * /programmes:
 *   post:
 *     summary: Create a new training program
 *     tags:
 *       - ProgrammeEntrainement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgrammeEntrainement'
 *     responses:
 *       201:
 *         description: Training program created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /programmes/{id}:
 *   put:
 *     summary: Update a training program by ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training program
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgrammeEntrainement'
 *     responses:
 *       200:
 *         description: Training program updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Training program not found
 */

/**
 * @swagger
 * /programmes/{id}:
 *   delete:
 *     summary: Delete a training program by ID
 *     tags:
 *       - ProgrammeEntrainement
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the training program
 *     responses:
 *       200:
 *         description: Training program deleted successfully
 *       404:
 *         description: Training program not found
 */

/**
 * @swagger
 * /programmes/generate:
 *   post:
 *     summary: Generate a workout plan
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
 *                 description: The goal of the workout (e.g., Perte de poids, Musculation, Endurance)
 *               createdBy:
 *                 type: string
 *                 description: The user who created the workout plan
 *     responses:
 *       201:
 *         description: Workout plan generated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /programmes/complete:
 *   put:
 *     summary: Mark an exercise as completed
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
 *                 description: The ID of the training program
 *               exerciseName:
 *                 type: string
 *                 description: The name of the exercise to mark as completed
 *     responses:
 *       200:
 *         description: Exercise marked as completed
 *       404:
 *         description: Programme or exercise not found
 *       500:
 *         description: Internal server error
 */