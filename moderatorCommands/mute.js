const Discord = require('discord.js');
const path = require('path');
const settings = require(path.resolve('sql.js'));

module.exports.run = async (client, message, args) => {
	const getMutedMember = message.mentions.members.first() || message.guild.members.get(args[0]);
	const getMutedReason = args.slice(1).join(' ');

	if(!getMutedMember || getMutedReason.length < 1) return message.channel.send('Error: Incorrect parameters sent!');

	const getMuteRole = await settings.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, 'muterole');
	if(!getMuteRole) return message.channel.send('Error: Settings have not been set up!');

	const findMuteRole = await message.guild.roles.get(getMuteRole.setting_value);
	if(!findMuteRole) return message.channel.send('Error: Cannot find mute role within this guild!');

	try {
		await getMutedMember.addRole(findMuteRole.id);
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setDescription(`User <@${getMutedMember.id}> has been muted due to: ${getMutedReason}\nThey have been muted by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'mute',
};
