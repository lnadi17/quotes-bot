# Stoic Bot

This project is a discord bot that, when added to your server, provides stoic quotes. 
It has a command `/speak`, which lets you interact with the bot and receive insightful quotes. 
It uses [public API](https://api.themotivate365.com/stoic-quote) that provides stoic quotes. 
I found it on [Public APIs on GitHub](https://github.com/public-apis/public-apis). 
Project uses Discord API directly, both [HTTP API](https://discord.com/developers/docs/reference#http-api) 
and [Gateway API](https://discord.com/developers/docs/reference#http-api). 
More usage and implementation details are described below.

## Installation

This bot is not in production at the time. If you want to create your own bot with the same functionality, 
you can follow these steps:

1. Create new application from the [Discord Developer Portal](https://discord.com/developers/applications).
2. Configure bot permissions. Mine uses four permissions: `Send Messages, Embed Links, Read Message History, Mention Everyone`.
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
- Project is configured as module so I had to use `babel-jest` to convert tested files to CJS.
- Existence of `process.env.JEST_WORKER_ID` is checked in application code to detect if the test is running.

