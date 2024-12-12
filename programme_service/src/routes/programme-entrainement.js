const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getAllProgrammeEntrainement,
    getProgrammeEntrainementById,
    getUserProgrammes,
    createProgrammeEntrainement,
    updateProgrammeEntrainement,
    deleteProgrammeEntrainement,
    generateWorkout,
    completeExercise,
} = require('../controllers/ProgrammeEntrainementControllers');

router.get('/', getAllProgrammeEntrainement);

router.get('/:id', getProgrammeEntrainementById);

router.get('/programmes/user', authMiddleware, getUserProgrammes);

router.post('/', authMiddleware, createProgrammeEntrainement);

router.post('/generate', authMiddleware, generateWorkout);

router.put('/complete', authMiddleware, completeExercise);

router.put('/:id', authMiddleware, updateProgrammeEntrainement);

router.delete('/:id', authMiddleware, deleteProgrammeEntrainement);

module.exports = router;