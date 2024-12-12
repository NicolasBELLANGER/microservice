const NutritionPlan = require('../model/NutritionModel');
//sconst User = require('../model/UserModel');
const { sendToQueue } = require('../config/rambitmq');

exports.generatePlan = async (p_req, p_res) => {
    try {
        const { userId, goal, preferences } = p_req.body;

        const newPlan = new NutritionPlan({
            userId: userId, 
            goal: goal, 
            preferences: preferences
        });
        
        await newPlan.save();

        await sendToQueue('nutritionActions', {
            event: 'NutritionPlanGenerated',
            userId,
            planId: newPlan._id,
            details: { goal, preferences },
        });

        p_res.status(201).json({ message: 'Plan nutritionnel généré avec succès.', plan: newPlan });
    } catch (error) {
        console.error(error);
        p_res.status(500).json({ message: 'Erreur lors de la génération du plan nutritionnel.' });
    }
};


// Enregistrer un repas consommé
exports.logMeal = async (p_req, p_res) => {
    const { planId } = p_req.params;
    const { mealDetails } = p_req.body;

    try {
        const plan = await NutritionPlan.findById(planId);
        if (!plan) {
            return p_res.status(404).json({ message: 'Plan non trouvé.' });
        }

        plan.loggedMeals.push(mealDetails);
        await plan.save();

        await sendToQueue('nutritionActions', {
            event: 'MealLogged',
            planId,
            mealDetails,
        });

        p_res.status(200).json({ message: 'Repas enregistré avec succès.', plan });
    } catch (error) {
        console.error(error);
        p_res.status(500).json({ message: 'Erreur lors de l\'enregistrement du repas.' });
    }
};

// Récupérer l'historique nutritionnel
exports.getHistory = async (p_req, p_res) => {
    
    const { userId } = p_req.params;

    try {
        const plans = await NutritionPlan.find({ userId });

        if (!plans || plans.length === 0) {
            return p_res.status(404).json({ message: 'Aucun plan nutritionnel trouvé pour cet utilisateur.' });
        }

        await sendToQueue('nutritionActions', {
            event: 'HistoryFetched',
            userId,
            planCount: plans.length,
        });

        p_res.status(200).json({ message: 'Historique des plans nutritionnels récupéré avec succès.', plans });
    } catch (error) {
        console.error(error);
        p_res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique des plans nutritionnels.' });
    }
};

// Donner un feedback
exports.giveFeedback = async (p_req, p_res) => {
    const { planId } = p_req.params;
    const { feedback } = p_req.body;

    try {
        const plan = await NutritionPlan.findById(planId);
        if (!plan) {
            return p_res.status(404).json({ message: 'Plan non trouvé.' });
        }

        plan.feedback = feedback;
        await plan.save();

        await sendToQueue('nutritionActions', {
            event: 'FeedbackGiven',
            planId,
            feedback,
        });

        p_res.status(200).json({ message: 'Feedback enregistré avec succès.' });
    } catch (error) {
        console.error(error);
        p_res.status(500).json({ message: 'Erreur lors de l\'enregistrement du feedback.' });
    }
};


// Modifier le commentaire (feedback) d'un plan nutritionnel
exports.updateComment = async (p_req, p_res) => {
    const { planId } = p_req.params;
    const { feedback } = p_req.body;

    try {
        console.log(`Plan ID reçu : ${planId}`);
        const plan = await NutritionPlan.findById(planId);
        if (!plan) {
            console.log('Plan non trouvé');
            return p_res.status(404).json({ message: 'Plan non trouvé.' });
        }

        plan.feedback = feedback;
        await plan.save();

        await sendToQueue('nutritionActions', {
            event: 'CommentUpdated',
            planId,
            feedback,
        });

        console.log('Commentaire mis à jour avec succès');
        p_res.status(200).json({ message: 'Commentaire mis à jour avec succès.', plan });
    } catch (error) {
        console.error('Erreur attrapée dans le try/catch :', error);
        p_res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire.' });
    }
};

// Supprimer un plan nutritionnel
exports.deletePlan = async (req, res) => {
    const { planId } = req.params;
  
    try {
      const plan = await NutritionPlan.findById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan non trouvé.' });
      }

    //   if (String(plan.userId) !== req.user._id) {
    //     return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce plan.' });
    //   }
  
      await plan.deleteOne();
  
      await sendToQueue('nutritionActions', {
        event: 'PlanDeleted',
        planId,
      });
  
      res.status(200).json({ message: 'Plan supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du plan nutritionnel.' });
    }
};
  