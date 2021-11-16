const fs = require('fs');
const { Client, Intents } = require('discord.js');
const { token, benId, channelId } = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.once('ready', (client) => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channelId === null && newState.channelId !== null && newState.member.id === benId) {
        console.log(`${newState.member.displayName} joined!`);
        await client.channels.cache.get(channelId).send(":musical_note: It's Ben!");
    }
});

client.login(token);