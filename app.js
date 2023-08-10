import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import logger from 'morgan';
import {verifyKeyMiddleware} from 'discord-interactions';

import {router as interactionsRouter} from './routes/interactions.js';
import {updatePresence} from './gatewayClient.js';

const app = express();
await updatePresence(true, 'Meditations');

app.use(logger('dev'));
app.use('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), interactionsRouter);

process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Error:", error)
    process.exit(1);
});

export default app;
