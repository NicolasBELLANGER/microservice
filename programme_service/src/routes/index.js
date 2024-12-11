const express = require('express');
const app = express();

const ProgrammeEntrainement = require('./programme-entrainement');

app.use('/programmes', ProgrammeEntrainement);

module.exports = app;
