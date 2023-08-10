import {InteractionResponseType, InteractionType} from "discord-interactions";
import express from 'express';
import axios from 'axios';

export const router = express.Router();

const endpoint = "https://api.themotivate365.com/stoic-quote"

export function filterQuote(quote) {
    const regexPattern = /[^a-zA-Z0-9\s!"\/%'()*+,-.:;<=>?[\]^_`{|}~]/g
    return quote.replace(regexPattern, '');
}

router.post('/', async function (req, res, next) {
    const data = req.body.data;
    const token = req.body.token;
    const patchUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`;

    if (req.body.type === InteractionType.PING) {
        res.send({
            type: InteractionResponseType.PONG,
        });
    } else if (data.name === 'ping') {
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Pong!',
            },
        });
    } else if (data.name === 'speak') {
        res.send({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        axios.get(endpoint)
            .then(result => {
                const author = result.data.author;
                // Use regex to remove non-alphanumeric and punctuation characters
                const quote = filterQuote(result.data.quote);
                const response = {
                    embeds: [{
                        author: {
                            name: author,
                        },
                        description: quote
                    }]
                };
                axios.patch(patchUrl, response);
            })
            .catch(error => {
                const response = {
                    content: "Sorry, I am feeling out of sorts, try again later..."
                };
                axios.patch(patchUrl, response);
            });
    } else {
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Such command does not exist... Or maybe it does?"
            }
        });
    }
});
