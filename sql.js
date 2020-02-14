const Database = require('better-sqlite3');
const db = new Database('SampleBot.sqlite');

const tables = new Map();

tables.set('settings', 'id INTEGER PRIMARY KEY AUTOINCREMENT, guildID TEXT NOT NULL, setting_name TEXT NOT NULL, setting_value TEXT NOT NULL');
tables.set('warnings', 'id INTEGER PRIMARY KEY AUTOINCREMENT, guildID TEXT NOT NULL, userID TEXT NOT NULL, reason TEXT NOT NULL, date TEXT NOT NULL');

for(const [key, value] of tables.entries()) {
	db.prepare(`CREATE TABLE IF NOT EXISTS ${key} (${value});`).run();
}
db.pragma('synchronous = 1');
db.pragma('journal_mode = WAL');

module.exports = db;
