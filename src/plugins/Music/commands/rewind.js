const Discord = require('discord.js');
const Utils = require("./../../../utils/utils")
const Music = require("./../utils/Music")
const MusicPlayer = require("./../utils/MusicPlayer")
require('dotenv/config');

module.exports = {
    validate(client, message) {
        return true;
    },
    /**
     * @param  {Discord.Client} client
     * @param  {Discord.Message} message
     * @param  {} args
     */
    run: async (client, message, args, LOCALE) => {
        var player = client.players.get(message.guild.id)
        if (!player) {
            return message.channel.send(LOCALE.errors.not_playing.interpolate({
                prefix: process.env.COMMAND_PREFIX
            }))
        }
        const tm = Number.parseInt(args[0])
        if(!args[0] || isNaN(tm)){
            return message.channel.send(LOCALE.errors.cmd_run_error.interpolate({
                prefix: process.env.COMMAND_PREFIX
            }))
        }
        // console.log(player.streamTime());
        // player.rewind(tm/1000)
        // console.log(player.streamTime());
        return message.channel.send(LOCALE.message);
    },

    get command() {
        return {
            name: 'rewind',
            aliases: [
                "retroceder",
                "rwd",
                "voltartempo"
            ]
        }
    },
};