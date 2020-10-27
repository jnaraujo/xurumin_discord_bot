const Discord = require('discord.js');
const database = require("./../../utils/database");
const Utils = require("./../../utils/utils");

const axios = require("axios").default;

module.exports = {
	validate(client, message) {
		if (!message.member.hasPermission('MANAGE_GUILD')) {
			throw new Error('no_permission');
		}
	},
	/**
	 * @param  {Discord.Client} client
	 * @param  {Discord.Message} message
	 * @param  {} args
	 */
	run: async (client, message, args) => {
		axios
			.get(`https://unsplash.com/napi/search/photos?query=fish&xp=&per_page=1&page=${Utils.random(0,100)}`)
			.then((res) => {
				return message.channel.send(
					new Discord.MessageEmbed()
					.setColor('#9d65c9')
					.setTitle("Vai um peixin? 🤠🐠")
					.setAuthor(client.user.username)
					.setImage(res.data["results"][0]["urls"]["small"])
					.setFooter(`Photo by ${res.data["results"][0]["user"]["name"]} on Unsplash`)
				)
			})
			.catch((err) => {
				console.log(err)
				return message.channel.send(Utils.getErrorMessage());
			})
	},

	get command() {
		return {
			name: 'peixe',
			description: '',
			usage: 'peixe',
		};
	},
};