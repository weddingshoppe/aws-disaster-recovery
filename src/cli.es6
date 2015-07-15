"use strict";

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
    .command('list [type]')
    .alias('l')
    .description('list all instances in aws')
    .option('--details [boolean]', 'show a detailed listing (used to trigger showing volume snapshots for images)', false)
    .option('--debug [boolean]', 'show extra debugging information', false)
    .option('-d, --dryrun [boolean]', 'Do a dry run of the backup process', false)
    .action(function(type, options) {
      commands.list(type, options, aws);
    });

  // new command
  program
    .command('backup <type> [instanceId]')
    .alias('b')
    .description('Creates an image of the aws instance(s), type param should be instance|all')
    //.option('-i, --instanceid', 'Backup specified instance', '')
    //.option('-a, --all [boolean]', 'Backup all instances', false)
    .option('-r, --reboot [boolean]', 'Reboot the server when requesting the AMI image', false)
    .option('-d, --dryrun [boolean]', 'Do a dry run of the backup process', false)
    .option('--debug [boolean]', 'show extra debugging information', false)
    .action(function (type, instanceId, options) {
      //console.log('options:', options);
      commands.backup(type, instanceId, options, slack);
    });


  //program.on('--help', function (){
  //  console.log('version: ' + version);
  //});
  //console.log('args are', args);
  program.parse(args);

  if (!program.args.length || program.args[0] === 'help') {
    program.help();
  }

};
