const Discord = require('discord.js');

module.exports.run = async (client, message, args, helper) => {
	const kickedMember = await helper.getUser(message.client, message, args[0]);
	if(kickedMember.id === message.author.id) return;
	const kickReason = args.slice(1).join(' ');

	if(!kickedMember > kickReason < 1) return message.channel.send('Error: Incorrect paramaters sent!');

	await message.guild.members.resolve(kickedMember.id).kick(kickReason);

	const embed = new Discord.MessageEmbed()
		.setColor('#8bb9dd')
		.setDescription(`User: <@${kickedMember.id} has been banned due to: ${kickReason}\nUser was banned by <@${message.author.id}>`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'kick',
};
