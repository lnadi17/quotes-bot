const axios = require('axios');
const request = require('supertest');
const bodyParser = require('body-parser');

// Mock the verifyKeyMiddleware function to always resolve
const {verifyKeyMiddleware, InteractionResponseType, InteractionType} = require("discord-interactions");
jest.mock("discord-interactions");
verifyKeyMiddleware.mockImplementation((publicKey) => {
    // Parse JSON body (verifyKeyMiddleware did this before)
    return bodyParser.json()
});

const app = require('../bin/www.js');

describe('POST /interactions', () => {
    const patchMock = jest.spyOn(axios, 'patch').mockImplementation(() => {
    });

    it('should return 200 and PONG response for a PING interaction', async () => {
      const response = await request(app)
            .post('/interactions')
            .send({
                type: InteractionType.PING,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: InteractionResponseType.PONG,
      });
    });

    it('responds with "Pong!" when given a "ping" command', async () => {
        const response = await request(app)
            .post('/interactions')
            .send({
                data: {
                    name: 'ping',
                },
                token: 'test_token',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Pong!',
            },
        });
    });

    it('responds with a deferred message and then with a quote when given a "speak" command', async () => {
        // Mock the axios.get call to return a specific quote
        const mockQuote = {
            author: 'Test Author',
            quote: 'Test Quote',
        };
        const expectedFollowup = {
            "embeds": [
                {
                    "author": {
                        "name": "Test Author"
                    },
                    "description": "Test Quote"
                }
            ]
        };
        jest.spyOn(axios, 'get').mockResolvedValue({data: mockQuote});

        const response = await request(app)
            .post('/interactions')
            .send({
                data: {
                    name: 'speak',
                },
                token: 'test_token',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });
        expect(patchMock.mock.lastCall[1]).toEqual(expectedFollowup);
    });

    it('responds with a deferred message and then with error message when the quote API fails', async () => {
        // Mock the axios.get call to throw an error
        const expectedFollowup = {
            content: "Sorry, I am feeling out of sorts, try again later..."
        };

        jest.spyOn(axios, 'get').mockRejectedValue(new Error('Test Error'));

        const response = await request(app)
            .post('/interactions')
            .send({
                data: {
                    name: 'speak',
                },
                token: 'test_token',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });
        expect(patchMock.mock.lastCall[1]).toEqual(expectedFollowup);
    });

    it('responds with an error message when given an unknown command', async () => {
        const response = await request(app)
            .post('/interactions')
            .send({
                data: {
                    name: 'unknown',
                },
                token: 'test_token',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Such command does not exist... Or maybe it does?',
            },
        });
    });
});