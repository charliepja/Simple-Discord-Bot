const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
	const baseURL = 'https://api.thecatapi.com/v1/images/search';
	const fetchKitty = await fetch(baseURL);
	const kittyJSON = await fetchKitty.json();

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setTimestamp();

	if(kittyJSON.length > 0) {
		embed.setImage(kittyJSON[0].url);
	}
	else {
		embed.setDescription('Error: Could not load random kitty!');
	}

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'cat',
};
