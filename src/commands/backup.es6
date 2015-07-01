var _                 = require('lodash');
var chalk             = require('chalk');

module.exports = function backup(options, aws) {
  console.log('backup works');
  //console.log('options are: ', options);
  var instanceid = options.instance;
  var all = options.all;


  console.log('instanceid is: ', instanceid);
  console.log('all is', all);
  //console.log('options are: ' + options[0]);

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
    console.log('result of getInstanceDescription', result);
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

      var params = {
        InstanceId: instance.InstanceId, /* required */
        Name: 'image of ' + instance.KeyName + '(' + instance.InstanceId + ')', /* required */
        //BlockDeviceMappings: instance.BlockDeviceMappings,
        Description: 'backup generated using awsdr',
        DryRun: false,
        NoReboot: true
      };

      return ec2.createImagePromised(params)
        .then(function(data) {
          console.log(
            'AMI has been queued',
            data.ImageId
          );
        })
        .catch(console.error);
    });
  }

  //var ec2 = new aws.EC2();
  //
  //ec2.describeInstances(params, function(err, data) {
  //  if (err) {
  //    // an error occurred
  //    console.log(err, err.stack);
  //  }
  //  else {
  //    // successful response
  //    //todo: look at changing these calls to use promises
  //    //https://github.com/jagregory/aws-es6-promise
  //    _.forEach(data.Reservations, function(n, key) {
  //
  //      _.forEach(n.Instances, function(instance, key) {
  //
  //        console.log(
  //          'starting backup of: ',
  //          _.padRight(chalk.red(instance.InstanceId), 14, ' '),
  //          _.padRight(instance.KeyName, 25, ' '),
  //          _.padRight(chalk.blue(instance.PublicIpAddress), 20, ' '),
  //          instance.State.Name
  //        );
  //
  //        var params = {
  //          InstanceId: instanceid, /* required */
  //          Name: 'image of ' + instance.KeyName + '(' + instanceid + ')', /* required */
  //          //BlockDeviceMappings: instance.BlockDeviceMappings,
  //          Description: 'backup generated using awsdr',
  //          DryRun: false,
  //          NoReboot: true
  //        };
  //
  //        ec2.createImage(params, function(err, data) {
  //          if (err) {
  //            // an error occurred
  //            console.log(err, err.stack);
  //          }
  //          else {
  //            // successful response
  //            //console.log(data);
  //            console.log(
  //              'AMI has been queued',
  //              data.ImageId
  //            );
  //          }
  //        });
  //      });
  //    });
  //  }
  //});
};
