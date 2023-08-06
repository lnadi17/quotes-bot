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
    }

    if (data.name === 'speak') {
        fetch(endpoint)
            .then(response => {
                return response.text();
            })
            .then(data => {
                const object = JSON.parse(data);
                const author = object.author;
                const quote = object.quote;
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
                console.log("error", error);
            });
    }
});

module.exports = router;
