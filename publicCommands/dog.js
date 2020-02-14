const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
	const baseURL = 'https://dog.ceo/api/breeds/image/random';

	const fetchPayload = await fetch(baseURL);
	const responseJSON = await fetchPayload.json();

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setTimestamp();

	if(responseJSON.status === 'success') {
		embed.setImage(responseJSON.message);
	}
	else {
		embed.setDescription('Error: Could not fetch random dog!');
	}

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'dog',
};
