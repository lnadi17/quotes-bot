import 'dotenv/config';
import {GetGlobalCommands, InstallGlobalCommands} from './utils.js';

// Simple test command
const TEST_COMMAND = {
    name: 'ping',
    description: 'I will reply "Pong!"',
    type: 1,
};

const SPEAK_COMMAND = {
    name: 'speak',
    description: 'I will give you some quote from a stoic philosopher',
    type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, SPEAK_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS).then(_ => {
    return GetGlobalCommands(process.env.APP_ID)
}).then(res => {
    return res.json();
}).then(data => {
    console.log("Commands Successfully Installed");
    console.log(data);
});