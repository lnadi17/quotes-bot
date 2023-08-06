require('dotenv').config()
const express = require('express');
const logger = require('morgan');

const interactionsRouter = require('./routes/interactions.js');
const {verifyKeyMiddleware} = require("discord-interactions");

const app = express();

app.use(logger('dev'));
app.use('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), interactionsRouter);

module.exports = app;
