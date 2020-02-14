const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
	const kickedMember = message.mentions.members.first() || message.guild.members.get(args[0]);
	const kickReason = args.slice(1).join(' ');

	if(!kickedMember > kickReason < 1) return message.channel.send('Error: Incorrect paramaters sent!');

	await kickedMember.kick(kickReason);

	const embed = new Discord.RichEmbed()
		.setColor('#c5cbe1')
		.setDescription(`User: <@${kickedMember.id} has been banned due to: ${kickReason}\nUser was banned by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'kick',
};
