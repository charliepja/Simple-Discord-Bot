const Discord = require('discord.js');
const path = require('path');
const settings = require(path.resolve('sql.js'));

module.exports.run = async (client, message, args) => {
	const possibleSettings = ['prefix', 'muterole'];
	if(args.length < 2) return message.channel.send('Error: Please supply setting name and setting value!');
	const settingToChange = args[0].toLowerCase();
	const settingValue = args[1];
	if(!possibleSettings.includes(settingToChange)) return message.channel.send('Error: Not a valid setting!');

	try {
		const doesExistAlready = await settings.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, settingToChange);
		if(doesExistAlready) {
			await settings.prepare('INSERT OR REPLACE INTO settings (id, guildID, setting_name, setting_value) VALUES (?, ?, ?, ?)').run(doesExistAlready.id, message.guild.id, settingToChange, settingValue);
		}
		else {
			await settings.prepare('INSERT OR REPLACE INTO settings (guildID, setting_name, setting_value) VALUES (?, ?, ?)').run(message.guild.id, settingToChange, settingValue);
		}
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setDescription(`${settingToChange} has been configured with value ${settingValue}`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'settings',
};
