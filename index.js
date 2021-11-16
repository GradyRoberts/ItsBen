const { Client, Intents } = require('discord.js');
const { NoSubscriberBehavior } = require('@discordjs/voice');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
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
    if (oldState.channelId !== newState.channelId && newState.channelId !== null && newState.member.id === benId) {
        console.log(`${newState.member.displayName} joined!`);
        await client.channels.cache.get(channelId).send(":musical_note: It's Ben!");
        
        const connection = joinVoiceChannel({
            channelId: newState.channelId,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator,
        });
        
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });

        const resource = createAudioResource('./resources/itsben.mp3');
        
        const subscription = connection.subscribe(player);
        
        player.play(resource);

        if (subscription) {
            setTimeout(() => {
                subscription.unsubscribe();
                connection.destroy();
                player.stop();
            }, 2000);
        }
    }
});

client.login(token);