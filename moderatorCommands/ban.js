const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
	const bannedMember = message.mentions.members.first() || message.guild.members.get(args[0]);
	const banReason = args.slice(1).join(' ');

	if(!bannedMember > banReason < 1) return message.channel.send('Error: Incorrect paramaters sent!');

	await bannedMember.ban({ reason: banReason });

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setDescription(`User: <@${bannedMember.id} has been banned due to: ${banReason}\nUser was banned by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'ban',
};
