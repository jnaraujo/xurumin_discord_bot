"use strict";

const {
    createCanvas,
    loadImage
} = require('canvas')
const Discord = require('discord.js');
const path = require("path")
const utils = require('./../../../utils/utils');
const Utils = require("./../../../utils/utils")

const ImageList = require("./../files/sexyanime/image_list.json")

require('dotenv/config');

function ImageGenerator(user_pic, anime) {
    return new Promise(async (resolve, reject) => {

        const canvas = createCanvas(anime.size[0],anime.size[1])
        const ctx = canvas.getContext('2d')

        ctx.drawImage(await loadImage(path.join(__dirname,"..",`/files/sexyanime/images/${anime.filename}`)), 0, 0, anime.size[0],anime.size[1]);
        ctx.drawImage(await loadImage(user_pic), anime.info[0],anime.info[1],anime.info[2],anime.info[3],);

        resolve(new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', { quality: 0.8 }), 'image.png')) 
    })

}

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
        return new Promise((resolve, reject) => {
            if (!message.channel.nsfw) {
                var msg = {
                    title: LOCALE.errors.nsfw_channel.title,
                    description: LOCALE.errors.nsfw_channel.description
                }
                return resolve(message.channel.send(
                    Utils.createSimpleEmbed(msg.title, msg.description)
                ));
            }
            const metioned_user = message.mentions.users.entries().next()
            var user_pic = message.author.avatarURL({
                format: "png",
                size: 256
            })
            if (metioned_user.value) user_pic = metioned_user.value[1].avatarURL({
                format: "png",
                size: 256
            });

            if (!user_pic) {
                var msg = {
                    title: LOCALE.errors.user_do_not_have_pic.title,
                    description: LOCALE.errors.user_do_not_have_pic.description
                }
                return resolve(message.channel.send(
                    Utils.createSimpleEmbed(msg.title, msg.description)
                ));
            }

            message.channel.startTyping()
            setTimeout(() => {
                message.channel.stopTyping();
            }, 5000);

            ImageGenerator(user_pic, utils.choice(ImageList))
                .then((image) => {
                    var msg = {
                        title: LOCALE.message.title,
                        description: LOCALE.message.description.interpolate({
                            author: message.author
                        })
                    }
                    const embed = new Discord.MessageEmbed()
                        .setColor('#9d65c9')
                        .setTitle(msg.title)
                        .setDescription(msg.description)
                        .attachFiles(image)
                        .setImage("attachment://image.png")
                    message.channel.stopTyping()
                    return resolve(message.channel.send(embed))

                })
                .catch((err) => {
                    message.channel.stopTyping()
                    return reject(err)
                })
        })
    },
    get command() {
        return {
            name: 'sexyanime',
            aliases:[
                "ecchi"
            ]
        }
    },
};