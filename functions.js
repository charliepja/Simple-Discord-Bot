const fs = require('fs');

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
