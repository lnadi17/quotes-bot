require('dotenv').config()
const express = require('express');
const logger = require('morgan');

const {router: interactionsRouter} = require('./routes/interactions.js');
const {verifyKeyMiddleware} = require("discord-interactions");

const app = express();

app.use(logger('dev'));
app.use('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), interactionsRouter);

process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Error:", error)
    process.exit(1);
});

module.exports = app;
