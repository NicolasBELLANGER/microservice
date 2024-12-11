/**
 * @swagger
 * components:
 *   schemas:
 *     ProgrammeEntrainement:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the training program
 *         description:
 *           type: string
 *           description: Description of the training program
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the exercise
 *               repetitions:
 *                 type: number
 *                 description: Number of repetitions
 *               sets:
 *                 type: number
 *                 description: Number of sets
 *               completed:
 *                 type: boolean
 *                 description: Whether the exercise is completed
 *         createdBy:
 *           type: string
 *           description: User who created the program
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 */
