const express = require('express');
const router = express.Router();
const NutritionController = require('../controller/NutritonController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', NutritionController.generatePlan);

router.post('/log/:planId', NutritionController.logMeal);

router.get('/history/:userId', NutritionController.getHistory);

router.post('/feedback/:planId', NutritionController.giveFeedback);

router.put('/comment/:planId', NutritionController.updateComment);

// router.delete('/delete/:planId', authMiddleware, NutritionController.deletePlan);
router.delete('/delete/:planId', NutritionController.deletePlan);

module.exports = router;
