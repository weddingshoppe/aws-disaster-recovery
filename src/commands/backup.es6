var _                 = require('lodash');
var chalk             = require('chalk');


module.exports = function backup(type, instanceId, options, slack) {
  //console.log('backup works');

  var debug = (true === options.debug || 'true' === options.debug);
  var all = (type === 'all');
  var reboot = (true === options.reboot || 'true' === options.reboot);
  var dryrun = (true === options.dryrun || 'true' === options.dryrun);
  var debug = (true === options.debug || 'true' === options.debug);
  if (debug) {
    console.log(chalk.yellow(_.padRight('',120, '-')));
    console.log(chalk.red(_.padRight('DEBUGGING INFO',120,' ')));
    console.log(chalk.blue(_.padRight('type is', 30 , ' ')), type);
    //console.log('options are: ', options);
    //var instanceid = options.instanceid;
    console.log(chalk.blue(_.padRight('debug is: ', 30, ' ')), debug);
    console.log(chalk.blue(_.padRight('instanceid is: ', 30, ' ')), instanceId);
    console.log(chalk.blue(_.padRight('all is:', 30, ' ')), all);
    //console.log('reboot is ' + reboot);
    console.log(chalk.blue(_.padRight('dryrun is: ', 30 , ' ')) + dryrun);
    console.log(chalk.blue(_.padRight('reboot is: ', 30, ' ')), reboot);
    //console.log('options are: ' + options[0]);
    console.log(chalk.yellow(_.padRight('',120, '-')));
  }


  require('datejs');

  var params = {
    DryRun: dryrun
  };

  if (!all && instanceId && instanceId.length) {
    params.InstanceIds = [
      instanceId
    ];
  }

  //working on wrapping all calls with promises.
  var awsPromised = require('aws-promised');
  var ec2 = awsPromised.ec2();

  ec2.describeInstancesPromised(params)
    .then(getInstanceDescription)
    .then(createImage)
    .catch(console.error);

  function getInstanceDescription(data) {
    //console.log('in getInstanceDescription', data);
    var result = [];
    _.forEach(data.Reservations, function(n, key) {
      _.forEach(n.Instances, function(instance, key) {
        result.push(instance);
      });
    });
    //console.log('result of getInstanceDescription', result);
    return result;
  }

  function createImage(instances) {
    _.forEach(instances, function(instance, key) {
      console.log(
        'creating image of: ',
        _.padRight(chalk.red(instance.InstanceId), 14, ' '),
        _.padRight(instance.KeyName, 25, ' '),
        _.padRight(chalk.blue(instance.PublicIpAddress), 20, ' '),
        instance.State.Name
      );

      var timestamp = new Date().toString('yyyyddMM-hhmmsstt');
      //console.log('timestamp is', timestamp);
      var displayTimestamp = new Date().toString('MM/dd/yyyy - hh:mm:ss tt');
      //console.log('display timestamp is', displayTimestamp);
      var params = {
        InstanceId: instance.InstanceId, /* required */
        Name: 'image of ' + instance.KeyName + ' (' + instance.InstanceId + ') on ' + timestamp, /* required */
        //BlockDeviceMappings: instance.BlockDeviceMappings,
        Description: instance.KeyName + ' backup generated using awsdr on ' + displayTimestamp,
        DryRun: false,
        NoReboot: true
      };

      return ec2.createImagePromised(params)
        .then(function(data) {
          console.log(
            'AMI has been queued',
            data.ImageId
          );
          updateSlack('Hey @jame - the AMI backup (' + data.ImageId + ') has been queued for ' + instance.KeyName);
        })
        .catch(function(err) {
          console.error(err);
          updateSlack('an error occurred queuing AMI backup for ' + instance.KeyName);
          updateSlack('here\'s the error message:');
          updateSlack(err);
        });
    });
  }

  function updateSlack(message) {
    slack.webhook({
      channel: process.env.SLACK_CHANNEL,
      username: process.env.SLACK_USERNAME,
      text: message
    }, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log('slack message sent: ' + message);
      }
    });
  }


};
