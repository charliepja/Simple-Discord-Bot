require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ fetchAllMembers: true });

client.moderatorCommands = new Discord.Collection();
client.publicCommands = new Discord.Collection();

const moderatorCommandFiles = fs.readdirSync('./moderatorCommands').filter(file => file.endsWith('.js'));
const publicCommandFiles = fs.readdirSync('./publicCommands').filter(file => file.endsWith('.js'));

for (const file of moderatorCommandFiles) {
	const moderatorCommand = require(`./moderatorCommands/${file}`);
	client.moderatorCommands.set(moderatorCommand.help.name, moderatorCommand);
}

for (const file of publicCommandFiles) {
	const publicCommand = require(`./publicCommand/${file}`);
	client.publicCommand.set(publicCommand.help.name, publicCommand);
}

client.on('ready', async () => {
	console.log(`${client.user.username} is online!`);
});

client.on('message', async () => {
	if(message.author.bot) return;
	if(message.channel.type !== 'text') return;

	const prefix = '!';
	const split = message.content.split(/ +/g);
	const commandName = split[0].slice(prefix.length).toLowerCase();
	const args = split.slice(1);

	if(message.member.hasPermission('SEND_MESSAGES') && client.publicCommands.has(commandName)) {
		try {
			const getCommand = client.publicCommands.get(commandName);
			getCommand.run(client, message, args);
			return;
		}
		catch(error) {
			console.log(error);
			message.channel.send('Error: Cannot run this command.');
		}
	}

	if(message.member.hasPermission('MANAGE_ROLES') && client.moderatorCommands.has(commandName)) {
		try {
			const getCommand = client.moderatorCommands.get(commandName);
			getCommand.run(client, message, args);
			return;
		}
		catch(error) {
			console.log(error);
			message.channel.send('Error: Cannot run this command.');
		}
	}
});

client.login(process.env.TOKEN);
