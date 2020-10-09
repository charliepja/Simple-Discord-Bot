const Discord = require('discord.js');
const path = require('path');
const settings = require(path.resolve('sql.js'));

module.exports.run = async (client, message, args) => {
	const newPrefix = args[0];
	if(newPrefix.length < 1) return message.channel.send('Error: Not a valid prefix!');

	try {
		const doesExistAlready = await settings.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, 'prefix');
		if(doesExistAlready) {
			await settings.prepare('INSERT OR REPLACE INTO settings (id, guildID, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(doesExistAlready.id, message.guild.id, 'prefix', newPrefix);
		}
		else {
			await settings.prepare('INSERT OR REPLACE INTO settings (guildID, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, 'prefix', newPrefix);
		}
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	const embed = new Discord.MessageEmbed()
		.setColor('#8bb9dd')
		.setDescription(`Prefix has been changed to ${newPrefix}`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'prefix',
};
