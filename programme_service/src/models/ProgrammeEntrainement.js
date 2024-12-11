const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const programmeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    exercises: [{
        name: {
            type: String,
            required: true,
        },
        repetitions: {
            type: Number,
            required: true,
        },
        sets: {
            type: Number,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    }],
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const ProgrammeEntrainement = mongoose.model('ProgrammeEntrainement', programmeSchema);
module.exports = ProgrammeEntrainement;