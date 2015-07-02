var _                 = require('lodash');
var chalk             = require('chalk');


module.exports = function backup(options, slack) {
  //console.log('backup works');
  //console.log('options are: ', options);
  var instanceid = options.instance;
  var all = options.all;
  //console.log('instanceid is: ', instanceid);
  //console.log('all is', all);
  //console.log('options are: ' + options[0]);

  require('datejs');

  var params = {
    DryRun: false
  };

  if (!all && instanceid && instanceid.length) {
    params.InstanceIds = [
      instanceid
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
    //console.log('in gxetInstanceDescription', data);
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
        Description: 'backup generated using awsdr on ' + displayTimestamp,
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
