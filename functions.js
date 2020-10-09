const fs = require('fs');
const Discord = require('discord.js');

module.exports.populateCommands = async (folder, collection) => {
	const getFiles = await fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));

	for (const file of getFiles) {
		const findCommand = require(`./${folder}/${file}`);
		collection.set(findCommand.help.name, findCommand);
	}

	return;
};

module.exports.findAndRunCommand = async (client, message, args, command, collection, permission) => {
	if(message.member.hasPermission(permission) && collection.has(command)) {
		try {
			const getCommand = collection.get(command);
			getCommand.run(client, message, args);
			return;
		}
		catch(error) {
			console.log(error);
			message.channel.send('Error: Cannot run this command.');
		}
	}
};

module.exports.getPrefix = async (guildID, db) => {
	const getPrefix = await db.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(guildID, 'prefix');
	if(getPrefix) {
		return getPrefix.setting_value;
	}
	return '!';
};

module.exports.teamPing = async (client, message, db) => {
	let pingChannel;
	let pingRole;

	try {
		pingChannel = await db.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, 'pingchannel');
		pingRole = await db.prepare('SELECT * FROM settings WHERE guildID = ? AND setting_name = ?').get(message.guild.id, 'pingrole');
	}
	catch(error) {
		console.error(error.toString());
	}

	if(!pingChannel || !pingRole) return;

	const pingLog = await client.channels.resolve(pingChannel.setting_value);
	if(!pingLog) return;
	const pingReceived = message.channel.id;
	const pingMsgID = message.id;
	const beforePing = await message.channel.messages.fetch({ limit: 10, before: pingMsgID });
	const beforePingID = await beforePing.map(m => m.id);
	const afterPing = await message.channel.messages.fetch({ limit: 10, after: pingMsgID });
	const afterPingID = await afterPing.map(m => m.id);
	const embed = new Discord.MessageEmbed()
		.setColor('#9B59B6')
		.setDescription(`**Ping received in <#${pingReceived}>**`)
		.setTimestamp();
	for(const m in beforePingID) {
		const msg = await message.channel.messages.fetch(beforePingID[m]);
		if(msg) {
			await embed.addField('\u200B', `${msg.cleanContent}\n${msg.author.tag}`);
		}
	}
	await embed.addField('\u200B', `**${message.cleanContent}**\n${message.author.tag}`);
	for(const m in afterPingID) {
		const msg = await message.channel.messages.fetch(afterPingID[m]);
		if(msg) {
			await embed.addField('\u200B', `${msg.cleanContent}\n${msg.author.tag}`);
		}
	}

	await pingLog.send(`<@&${pingRole.setting_value}>`, { embed: embed, split: true });
};

module.exports.getUser = async (client, message, mention) => {
	if(mention) {
		const matches = mention.match(/^<@!?(\d+)>$/);
		if(matches && matches.length > 0) {
			const userid = matches[1];
			return client.users.resolve(userid);
		}
		else {
			return client.users.resolve(mention);
		}
	}
	else {
		return client.users.resolve(message.author.id);
	}
};
