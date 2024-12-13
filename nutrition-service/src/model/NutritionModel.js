const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    time: Date,
});

const NutritionPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    goal: {
        type: String,
        required: true,
    },
    preferences: {
        type: [String],
        default: [],
    },
    loggedMeals: {
        type: [MealSchema],
        default: [],
    },
    feedback: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('NutritionPlan', NutritionPlanSchema);
