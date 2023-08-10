import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
import WebSocket from 'ws';

let heartbeatInterval;
let lastSequenceNumber;
let heartbeatIntervalFunction;
async function getGatewayData() {
    const getGatewayUrl = "https://discord.com/api/gateway/bot";
    const token = process.env.DISCORD_TOKEN;
    return axios.get(getGatewayUrl, {
        headers: {
            Authorization: `Bot ${token}`
        }
    }).then((response) => {
        return response.data;
    });
}

export async function updatePresence(keepAlive = false, listeningToActivity = "Meditations") {
    getGatewayData().then((data) => {
        const url = data.url + "/?v10&encoding=json";
        const client = new WebSocket(url);

        client.on('open', () => {
            console.log("Opened");
        })

        client.on('message', (data) => {
            data = JSON.parse(data);
            if (data.op === 10) {
                console.log("Hello");
                heartbeatInterval = data.d.heartbeat_interval;
                lastSequenceNumber = data.s;
                const waitTime = heartbeatInterval * Math.random();
                // Send first heartbeat
                console.log("Setting first heartbeat in", (waitTime / 1000));
                setTimeout(() => {
                    client.send(JSON.stringify({
                        op: 1,
                        d: lastSequenceNumber
                    }));
                }, waitTime);
            } else if (data.op === 11) {
                console.log("Heartbeat ACK")
                lastSequenceNumber = data.s;
                if (!heartbeatIntervalFunction) {
                    console.log("Setting heartbeat interval function")
                    heartbeatIntervalFunction = setInterval(() => {
                        console.log("Heartbeat");
                        client.send(JSON.stringify({
                            op: 1,
                            d: lastSequenceNumber
                        }));
                    }, heartbeatInterval);

                    // Send Identify
                    console.log("Sending identify");
                    client.send(JSON.stringify({
                        op: 2,
                        d: {
                            token: process.env.DISCORD_TOKEN,
                            properties: {
                                os: "Metaphysics",
                                browser: "Metal",
                                device: "Metal"
                            },
                            presence: {
                                status: 'online',
                                afk: false,
                                activities: [
                                    {
                                        type: 2,
                                        name: listeningToActivity,
                                    }]
                            },
                            intents: 0
                        }
                    }))
                }
            } else if (data.op === 0) {
                if (!keepAlive) {
                    // Close the connection because presence is already updated
                    console.log("Closing connection");
                    client.close();
                }
            } else {
                console.log("Unexpected opcode", data);
            }
        });

        client.on('close', () => {
            console.log('Client disconnected')
            clearInterval(heartbeatIntervalFunction);
        })

        client.on('error', (error) => {
            console.log("Error:", error);
            clearInterval(heartbeatIntervalFunction);
        })
    });
}
