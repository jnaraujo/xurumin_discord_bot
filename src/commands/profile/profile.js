const Discord = require('discord.js');
const Utils = require("./../../utils/utils")
const fs = require("fs")

const ImageProcessor = require("./ImageProcessor");
const utils = require('./../../utils/utils');


module.exports = {
	validate(client, message) {
		return true;
	},
	/**
	 * @param  {Discord.Client} client
	 * @param  {Discord.Message} message
	 * @param  {Array} args
	 */
	run: (client, message, args, LOCALE) => {
		return new Promise(async(resolve, reject)=>{
			message.channel.startTyping();
			setTimeout(() => {
				message.channel.stopTyping();
			}, 5000);
			let user;
			if (message.mentions.users.size > 0) {
				user = message.mentions.users.entries().next().value[1]
			}else{
				user = message.author
			}

			let profile;
			if(utils.Profile.hasProfile(client, user.id)){
				if(!utils.Profile.getProfile(client, user.id).aboutme || utils.Profile.getProfile(client, user.id).aboutme == ""){
					utils.Profile.setTag(client, user.id, "aboutme",LOCALE.stardard.aboutme)
				}
				profile = utils.Profile.getProfile(client, user.id)
			}else{
				utils.Profile.setProfile(client, user.id, "https://i.imgur.com/MbGPZQR.png",LOCALE.stardard.aboutme, 0, 0)
				profile = utils.Profile.getProfile(client,user.id)

			}
			

			ImageProcessor(user.avatarURL({
				format: "png"
			}), user,profile, LOCALE.profile)
			.then((image)=>{
				const embed = new Discord.MessageEmbed()
				.setColor('#9d65c9')
				.setTitle(LOCALE.message.title.interpolate({author: user.username}))
				.setDescription("Background Photo by Unsplash")
				.setAuthor(client.user.username)
				.attachFiles(image)
				.setImage("attachment://image.png")
				message.channel.stopTyping()
				resolve(message.channel.send(embed))
			})
			.catch((err)=>{
				reject(err)
			})
		})
	},

	get command() {
		return {
			name: 'profile',
			aliases: [
			]
		};
	},
};