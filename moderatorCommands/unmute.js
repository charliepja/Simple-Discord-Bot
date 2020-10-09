const Discord = require('discord.js');
const path = require('path');
const settings = require(path.resolve('sql.js'));

module.exports.run = async (client, message, args, helper) => {
	const getMember = await helper.getUser(message.client, message, args[0]);
	if(getMember.id === message.author.id) return;
	const getMutedMember = await message.guild.members.resolve(getMember.id);

	const getMuteRole = await settings.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, 'muterole');
	if(!getMuteRole) return message.channel.send('Error: Settings have not been set up!');

	const findMuteRole = await message.guild.roles.resolve(getMuteRole.setting_value);
	if(!findMuteRole) return message.channel.send('Error: Cannot find mute role within this guild!');

	try {
		await getMutedMember.roles.remove(findMuteRole.id);
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#8bb9dd')
		.setDescription(`User <@${getMutedMember.id}> has been unmuted by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'unmute',
};
