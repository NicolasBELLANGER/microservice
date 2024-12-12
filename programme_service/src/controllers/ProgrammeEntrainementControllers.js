const { publishToQueue } = require('../config/rabbitmq');
const ProgrammeEntrainement = require('../models/ProgrammeEntrainement');
const { verifyProgrammeEntrainement } = require('../validator/ProgrammeEntrainementValidator');

const mongoose = require('mongoose');

const getAllProgrammeEntrainement = async (req, res) => {
    try{
        const programme = await ProgrammeEntrainement.find();
        return res.status(200).json(programme);
    } catch(error){
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

const getProgrammeEntrainementById = async (req, res) => {
    try{
        const programme = await ProgrammeEntrainement.findById(req.params.id);
        if(!programme){
            return res.status(404).json({error: 'Programme not found'});
        }
        return res.status(200).json(programme);
    } catch(error){
        if(error.name === 'CastError' && error.kind === 'ObjectId'){
            return res.status(400).json({error: 'Invalid Programme Id'})
        }
        return res.status(500).json({ error: `Internal server error: ${error}` });
    }
};

const getUserProgrammes = async (req, res) => {
  try {
      const userId = req.user._id;

      const programmes = await ProgrammeEntrainement.findById( req.user._id );

      if (programmes.length === 0) {
          return res.status(404).json({ error: 'Aucun programme trouvé pour cet utilisateur' });
      }

      return res.status(200).json(programmes);
  } catch (error) {
      console.error('Error fetching user programmes:', error);
      return res.status(500).json({ error: `Erreur serveur interne: ${error.message}` });
  }
};

const createProgrammeEntrainement = async (req, res) => {
    try {
      const errors = verifyProgrammeEntrainement(req);
      if (errors) {
        return res.status(400).json({ errors });
      }
        const newProgramme = new ProgrammeEntrainement({
        name: req.body.name,
        description: req.body.description,
        exercises: req.body.exercises,
        createdBy: req.user._id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
  
      const savedProgramme = await newProgramme.save();

      //Publier un message dans RabbitMQ
      await publishToQueue('programmeUpdates', JSON.stringify({
        event: 'ProgrammeCreated',
        programme: savedProgramme,
      }));

      return res.status(201).json({ programme: savedProgramme });
    } catch (error) {
      console.error('Error in createProgramme:', error);
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  };

const updateProgrammeEntrainement = async (req, res) => {
    try {
      const programme = await ProgrammeEntrainement.findById(req.params.id);
  
      if (!programme) {
        return res.status(404).json({ error: 'Programme not found' });
      }
      programme.name = req.body.name || programme.name;
      programme.description = req.body.description || programme.description;
      programme.exercises = req.body.exercises || programme.exercises;
      programme.updatedAt = Date.now();
  
      const updatedProgramme = await programme.save();
  
      // Publier message RabbitMQ
      await publishToQueue('programmeUpdates', JSON.stringify({
        event: 'ProgrammeUpdated',
        programme: updatedProgramme,
      }));

      return res.status(200).json({
        message: 'Programme updated',
        programme: updatedProgramme,
      });
    } catch (error) {
      console.error('Error updating programme:', error);
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

const deleteProgrammeEntrainement = async (req, res) => {
    try {
      const programme = await ProgrammeEntrainement.findById(req.params.id);
      if (!programme) {
        return res.status(404).json({ error: 'Programme not found' });
      }
      await programme.deleteOne();

      // Publier un message dans RabbitMQ
      await publishToQueue('programmeUpdates', JSON.stringify({
        event: 'ProgrammeDeleted',
        programmeId: req.params.id,
      }));

      return res.status(200).json({ message: 'Programme deleted successfully' });
    } catch (error) {
      console.error('Error deleting programme:', error);
      return res.status(400).json({ error: error.message });
    }
};

const generateWorkout = async (req, res) => {
    try {
      const { goal, createdBy } = req.body;
  
      let exercises = [];
      if (goal === 'Perte de poids') {
        exercises = [
          { name: 'Burpees', repetitions: 15, sets: 3 },
          { name: 'Mountain Climbers', repetitions: 20, sets: 4 },
        ];
      } else if (goal === 'Musculation') {
        exercises = [
          { name: 'Pompes', repetitions: 15, sets: 3 },
          { name: 'Squats', repetitions: 20, sets: 4 },
        ];
      } else if (goal === 'Endurance') {
        exercises = [
          { name: 'Course à pied', repetitions: 600, sets: 1 },
          { name: 'Jump Rope', repetitions: 100, sets: 3 },
        ];
      } else {
        return res.status(400).json({ error: 'Invalid goal' });
      }
  
      const newProgramme = new ProgrammeEntrainement({
        name: `Plan d'entraînement pour ${goal}`,
        description: `Plan généré pour atteindre l'objectif : ${goal}`,
        exercises,
        createdBy: req.user._id,
      });
  
      const savedProgramme = await newProgramme.save();

      //Publier un message dans rabbitMQ
      await publishToQueue('workoutGeneration', JSON.stringify({
        event: 'WorkoutGenerated',
        programme: savedProgramme,
      }));

      return res.status(201).json({ programme: savedProgramme });

    } catch (error) {
      console.error('Error in generateWorkout:', error.message);
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  };

  const completeExercise = async (req, res) => {
    try {
      const { programmeId, exerciseName } = req.body;
  
      const programme = await ProgrammeEntrainement.findById(programmeId);
      if (!programme) {
        return res.status(404).json({ error: 'Programme not found' });
      }
  
      const exercise = programme.exercises.find((ex) => ex.name === exerciseName);
      if (!exercise) {
        return res.status(404).json({ error: 'Exercise not found' });
      }
  
      exercise.completed = true;
      programme.updatedAt = Date.now();
  
      await programme.save();

      //Publier un message dans RabbitMQ
      await publishToQueue('exerciceCompletion', JSON.stringify({
        event: 'ExerciceCompleted',
        programmeId: programmeId,
        exerciseName: exerciseName,
        completedAt: new Date(),
      }));

      return res.status(200).json({ programme });
    } catch (error) {
      console.error('Error in completeExercise:', error.message);
      return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  };

module.exports = {
    getAllProgrammeEntrainement,
    getProgrammeEntrainementById,
    getUserProgrammes,
    createProgrammeEntrainement,
    updateProgrammeEntrainement,
    deleteProgrammeEntrainement,
    generateWorkout,
    completeExercise,
};
