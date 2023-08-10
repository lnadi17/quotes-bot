# Stoic Bot

<img width="400" alt="Screenshot 2023-08-11 at 00 52 51" src="https://github.com/lnadi17/stoic-bot/assets/19193250/b66252ba-5412-422a-863d-f78418704073">

This project is a discord bot that, when added to your server, provides various stoic quotes. 
It has a command `/speak`, which lets you interact with the bot and receive insightful quotes. 
It uses [public API](https://api.themotivate365.com/stoic-quote), sourced from [Public APIs on GitHub](https://github.com/public-apis/public-apis), to provide stoic quotes. 
Project interfaces with Discord API directly, both [HTTP API](https://discord.com/developers/docs/reference#http-api) 
and [Gateway API](https://discord.com/developers/docs/reference#http-api). 
More details about usage and implementation are provided below.

## Installation

This bot is not in production at the time. If you want to create your own bot with the same functionality, 
you can follow these steps:

1. Create new application from the [Discord Developer Portal](https://discord.com/developers/applications).
2. Configure bot permissions. Mine uses four permissions: `Send Messages`, `Embed Links`, `Read Message History`, `Mention Everyone`.
3. Generate OAuth2 URL with the bot permissions above and `applications.commands` scope. This URL will allow you to invite the bot to your server.
4. Clone this repository and navigate to it.
5. Create `.env` file and put `APPLICATION_ID`, `PUBLIC_KEY` and `DISCORD_TOKEN` variables in it. These values can be found on your general information page of Discord Developer Portal.
6. Configure "Interactions Endpoint URL" from the general information page. I use [Ngrok](https://ngrok.com/) to generate the public URL address during the development. It is as simple as running `ngrok http 3000` command.
8. Run `npm install` to install packages.
9. Run `npm register` to register slash commands for the bot.

At this point your bot should be ready to be used. You can use `npm start` to run the application. 
If you want to automatically rerun the server after changing the code, use `npm dev` command.

## Testing

- Tests are written in Jest and run using GitHub Actions on push and pull requests.
- You can also run tests locally using `npm test`.
- `supertest` package is used for testing HTTP endpoints.
- Project is configured as module so I had to use `babel-jest` to convert tested files to CJS.
- Existence of `process.env.JEST_WORKER_ID` is checked in application code to detect if the test is running.

## Implementation Details

- `commands.js` file describes slash commands and when run as a script it registers them.
- Slash command interactions are handled by `routes/interactions.js` route file. 
- Gateway API is handled by `gatewayClient.js` file. Bot only updates its presence and then maintains the connection.
- `app.js` is the main entry point for the app.

## Dependencies

The bot relies on the following external libraries and tools:
- `ws`: Used in `gatewayClient.js` to establish a WebSocket connection to the Discord Gateway API.
- `express`: Powers the HTTP server that handles slash command interactions.
- `axios`: Enables HTTP requests for fetching stoic quotes and interacting with APIs.
- `discord-interactions`: Facilitates interaction with the Discord API, specifically slash commands.

## License

This project is licensed under the MIT License, allowing you to use, modify, and distribute the code as needed. See the [LICENSE](LICENSE) file for more details.
