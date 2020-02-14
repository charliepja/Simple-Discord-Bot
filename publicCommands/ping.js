const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
	try {
		const getPing = await message.client.ping;

		const embed = new Discord.RichEmbed()
			.setColor('#c5cbe1')
			.setDescription(`Average heartbeat ping: ${getPing.toFixed(2)} ms`)
			.setTimestamp();

		message.channel.send({ embed: embed });
	}
	catch(err) {
		if(err) return message.channel.send('Error: Cannot run this command!');
	}
};

module.exports.help = {
	name: 'ping',
};
