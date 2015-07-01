var _                 = require('lodash');
var chalk             = require('chalk');

module.exports = function backup(instanceid, options, aws) {
  console.log('backup works');
  console.log('instanceid is: ' + instanceid);
  console.log('options are: ' + options[0]);

  var params = {
    DryRun: false,
    InstanceIds: [
      instanceid
    ]
  };

  var ec2 = new aws.EC2();

  ec2.describeInstances(params, function(err, data) {
    if (err) {
      // an error occurred
      console.log(err, err.stack);
    }
    else {
      // successful response
      //todo: look at changing these calls to use promises
      //https://github.com/jagregory/aws-es6-promise
      _.forEach(data.Reservations, function(n, key) {

        _.forEach(n.Instances, function(instance, key) {

          console.log(
            'starting backup of: ',
            _.padRight(chalk.red(instance.InstanceId), 14, ' '),
            _.padRight(instance.KeyName, 25, ' '),
            _.padRight(chalk.blue(instance.PublicIpAddress), 20, ' '),
            instance.State.Name
          );

          var params = {
            InstanceId: instanceid, /* required */
            Name: 'image of ' + instance.KeyName + '(' + instanceid + ')', /* required */
            //BlockDeviceMappings: instance.BlockDeviceMappings,
            Description: 'backup generated using awsdr',
            DryRun: false,
            NoReboot: true
          };

          ec2.createImage(params, function(err, data) {
            if (err) {
              // an error occurred
              console.log(err, err.stack);
            }
            else {
              // successful response
              //console.log(data);
              console.log(
                'AMI has been queued',
                data.ImageId
              );
            }
          });
        });
      });
    }
  });
};