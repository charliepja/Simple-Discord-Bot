const Discord = require('discord.js');

module.exports.run = async (client, message, args, helper) => {
	const bannedMember = await helper.getUser(message.client, message, args[0]);
	if(bannedMember.id === message.author.id) return;
	const banReason = args.slice(1).join(' ');

	if(!bannedMember > banReason < 1) return message.channel.send('Error: Incorrect paramaters sent!');

	await message.guild.ban(bannedMember, { reason: banReason });

	const embed = new Discord.MessageEmbed()
		.setColor('#8bb9dd')
		.setDescription(`User: <@${bannedMember.id} has been banned due to: ${banReason}\nUser was banned by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'ban',
};
