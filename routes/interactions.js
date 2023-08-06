const {InteractionResponseType} = require("discord-interactions");
const express = require('express');
const router = express.Router();

let endpoint = "https://api.themotivate365.com/stoic-quote"

router.post('/', async function (req, res, next) {
    const data = req.body.data;

    if (data.name === 'ping') {
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Pong!',
            },
        });
    } else if (data.name === 'speak') {
        fetch(endpoint)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const author = data.author;
                // Use regex to remove non-alphanumeric and punctuation characters
                const regexPattern = /[^a-zA-Z0-9\s!"\/%'()*+,-.:;<=>?[\\\]^_`{|}~]/g
                const quote = data.quote.replace(regexPattern, '');
                res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        embeds: [{
                            author: {
                                name: author,
                            },
                            description: quote
                        }]
                    }
                });
            })
            .catch(error => {
                console.log("Error:", error)
                res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: "Sorry, I am feeling out of sorts, try again later..."
                    }
                });
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
