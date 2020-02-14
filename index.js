require('dotenv').config();
const Discord = require('discord.js');
const path = require('path');
const functions = require(path.resolve('functions.js'));
const settings = require(path.resolve('sql.js'));
const client = new Discord.Client({ fetchAllMembers: true });

client.adminCommands = new Discord.Collection();
client.moderatorCommands = new Discord.Collection();
client.publicCommands = new Discord.Collection();

functions.populateCommands('adminCommands', client.adminCommands);
functions.populateCommands('moderatorCommands', client.moderatorCommands);
functions.populateCommands('publicCommands', client.publicCommands);

client.on('ready', async () => {
	console.log(`${client.user.username} is online!`);
});

client.on('message', async (message) => {
	if(message.author.bot) return;
	if(message.channel.type !== 'text') return;

	const prefix = await functions.getPrefix(message.guild.id, settings);
	const split = message.content.split(/ +/g);
	const commandName = split[0].slice(prefix.length).toLowerCase();
	const args = split.slice(1);

	functions.findAndRunCommand(client, message, args, commandName, client.publicCommands, 'SEND_MESSAGES');
	functions.findAndRunCommand(client, message, args, commandName, client.moderatorCommands, 'MANAGE_ROLES');
	functions.findAndRunCommand(client, message, args, commandName, client.adminCommands, 'ADMINISTRATOR');
});

client.login(process.env.TOKEN);
