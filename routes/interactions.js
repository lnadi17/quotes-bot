const {InteractionResponseType} = require("discord-interactions");
const express = require('express');
const router = express.Router();
const axios = require('axios');

const endpoint = "https://api.themotivate365.com/stoic-quote"

router.post('/', async function (req, res, next) {
    const data = req.body.data;
    const token = req.body.token;
    const patchUrl = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`;
    const postUrl = `https://discord.com/api/v10/interactions/${req.body.id}/${token}/callback`;

    if (data.name === 'ping') {
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Pong!',
            },
        });
    } else if (data.name === 'speak') {
        await axios.post(postUrl, {
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        axios.get(endpoint)
            .then(result => {
                const author = result.data.author;
                // Use regex to remove non-alphanumeric and punctuation characters
                const regexPattern = /[^a-zA-Z0-9\s!"\/%'()*+,-.:;<=>?[\\\]^_`{|}~]/g
                const quote = result.data.quote.replace(regexPattern, '');
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
                console.log("Error:", error);
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

module.exports = router;
