const Discord = require('discord.js');
const moment = require('moment');
const path = require('path');
const settings = require(path.resolve('sql.js'));

module.exports.run = async (client, message, args, helper) => {
	const getMember = await helper.getUser(message.client, message, args[0]);
	if(getMember.id === message.author.id) return;
	const getReason = args.slice(1).join(' ');

	if(!getMember || getReason.length < 1) return message.channel.send('Error: Incorrect parameters sent!');

	try {
		const getDate = moment().format('DD MM YY');
		await settings.prepare('INSERT OR REPLACE INTO warnings (guildID, userID, reason, date) VALUES (?, ?, ?, ?)').run(message.guild.id, getMember.id, getReason, getDate);
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	let totalWarnings;

	try {
		const getAllWarnings = settings.prepare('SELECT * FROM warnings WHERE guildID = ? AND userID = ?').all(message.guild.id, getMember.id);
		totalWarnings = getAllWarnings.length;
	}
	catch(err) {
		if(err) return message.channel.send(`Error! ${err.message}`);
	}

	const embed = new Discord.MessageEmbed()
		.setColor('#8bb9dd')
		.setDescription(`<@${getMember.id}> has been warned for ${getReason} by <@${message.author.id}>\n\n<@${getMember.id}> has a total of ${totalWarnings} warnings`)
		.setTimestamp();

	message.channel.send({ embed: embed });
};

module.exports.help = {
	name: 'warn',
};
