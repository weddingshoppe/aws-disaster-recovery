var helpCommand = require('./commands/help');
var backupCommand = require('./commands/backup');
var listCommand = require('./commands/list');

module.exports = function(args) {
  console.log('args', args);
}

module.exports.help = helpCommand;
module.exports.backup = backupCommand;
module.exports.list = listCommand;