"use strict"

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

var program                         = require('commander');
var { version, name }               = require('../package.json');
var chalk                           = require('chalk');
var commands                        = require('./commands');
var aws                             = require('aws-sdk');
var Slack                           = require('slack-node');

module.exports = function cli(args) {

  try {
    require('dotenv').load();
  } catch (e) {
    console.log('No .env file loaded, using actual environment variables.');
  }

  aws.config.update({region: process.env.AWS_REGION});

  var slack = new Slack();
  slack.setWebhook(process.env.SLACK_URI);


  program
    .version(version)
    .usage('<command>');

  //list command - list all instances in the aws account we're setup to use
  program
    .command('list [filter]')
    .alias('l')
    .description('list all instances in aws')
    .action(function(filter, options) {
      commands.list(filter, options, aws);
    });

  // new command
  program
    .command('backup')
    .alias('b')
    .description('Creates an image of the input aws instance, optionally pass a filter string')
    .option('-i, --instance', 'Backup specified instance', '')
    .option('-a, --all', 'Backup all instances', true)
    .option('-r, --no-reboot', 'Do not reboot the server when requesting the AMI image', true)
    .option('-d, --dryrun', 'Do a dry run of the backup process', false)
    .action(function (options) {
      commands.backup(options, slack);
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
