'use strict';

//var Cli = require('soil-cli');
//
//class AwsdrCli extends Cli {
//
//  constructor(args, options) {
//    super(args, options);
//  }
//}
//
//module.exports = AwsdrCli;

var program = require('commander');

var _require = require('../package.json');

var version = _require.version;
var name = _require.name;

var chalk = require('chalk');
var commands = require('./commands');
var aws = require('aws-sdk');

module.exports = function cli(args) {

  aws.config.update({ region: 'us-east-1' });

  program.version(version).usage('<command>');

  //list command - list all instances in the aws account we're setup to use
  program.command('list [filter]').alias('l').description('list all instances in aws').action(function (filter, options) {
    commands.list(filter, options, aws);
  });

  // new command
  program.command('backup <instanceid>').alias('b').description('Creates an image of the input aws instance, optionally pass a filter string')
  //.option('-d, --database [type]', 'Options: disk (default), mongo, mysql, postgres, redis', config.database || 'disk')
  //.option('-D, --docker [boolean]', 'Setup Sails server and dependencies within docker containers.', config.docker || false)
  //.option('-v, --verbose [boolean]', 'Show more detailed command output.', config.verbose || false)
  //.option('--skip-npm [boolean]', 'Skips npm installation for ember-cli project creation', config.skipNpm || false)
  //.option('--skip-bower [boolean]', 'Skips bower installation for ember-cli project creation', config.skipBower || false)
  .action(function (instanceid, options) {
    commands.backup(instanceid, options, aws);
    //.catch(function (error) {
    //  console.log(chalk.red(error.message));
    //  console.log(error.stack);
    //});
  });

  //program.on('--help', function (){
  //  console.log('version: ' + version);
  //});

  program.parse(args);

  if (!program.args.length || program.args[0] === 'help') {
    program.help();
  }
};