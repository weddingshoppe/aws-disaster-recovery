var _                 = require('lodash');
var chalk             = require('chalk');
var moment            = require('moment');

module.exports = function list(type, options, aws) {
  //console.log('list works');
  //console.log('filter is: ' + filter);
  //console.log(JSON.stringify(options, null, 4));

  //require('datejs');

  var showInstances   = (type !== 'images');
  var debug           = (true === options.debug || 'true' === options.debug);
  var detailedPrint   = (true === options.details || 'true' === options.details);
  var params = {
    DryRun: false
  };

  var awsPromised = require('aws-promised');
  var ec2 = awsPromised.ec2();

  if (showInstances) {
    ec2.describeInstancesPromised(params)
      .then(printContents)
      .catch(console.error);
  } else {

    params.Owners = [
      'self'
    ];

    ec2.describeImagesPromised(params)
      .then(printImageContents)
      .catch(console.error);
  }



  function printContents(data) {
    //console.log(data); // contents of foo.txt
    console.log(
      _.padRight(chalk.green('InstanceId'), 20, ' '),
      _.padRight(chalk.red('KeyName'), 30, ' '),
      _.padRight('InstanceType', 20, ' '),
      _.padRight(chalk.blue('PublicIpAddress'), 30, ' '),
      _.padRight(chalk.green('Monitoring'), 30, ' '),
      'State'
    );
    console.log(_.padRight('',120,'-'));

    _.forEach(data.Reservations, function(n, key) {
      //console.log(n, key);
      //console.log(n);
      _.forEach(n.Instances, function(instance, key) {
        console.log(
          _.padRight(chalk.green(instance.InstanceId), 20, ' '),
          _.padRight(chalk.red(instance.KeyName), 30, ' '),
          _.padRight(instance.InstanceType, 20, ' '),
          _.padRight(chalk.blue(instance.PublicIpAddress || 'n/a'), 30, ' '),
          _.padRight(chalk.green(instance.Monitoring.State == 'enabled' ? 'monitored' : 'not monitored'), 30, ' '),
          instance.State.Name
        );
      });
    });
  }

  function printImageContents(data) {
    //console.log(data); // contents of foo.txt

    console.log(
      _.padRight(chalk.green('Image Id'), 25, ' '),
      _.padRight(chalk.red('Name'), 80, ' '),
      _.padRight('Creation Date', 25, ' '),
      _.padRight('Platform', 25, ' '),
      _.padRight('Owner', 20, ' '),
      _.padRight(chalk.blue('State'), 30, ' ')
    );
    console.log(_.padRight('',120,'-'));

    var sortedData = data.Images.sort(function(obj1, obj2) {
      return moment(obj1.CreationDate) - moment(obj2.CreationDate);
    });

    var totalStoredGp2 = 0;
    var totalStoredIo1 = 0;
    var totalStoredIops = 0;

    // iterate over each image
    _.forEach(sortedData, function(image, key) {
      // print details of each image
      console.log(
        _.padRight(chalk.green(image.ImageId), 25, ' '),
        _.padRight(chalk.red(image.Name), 80, ' '),
        _.padRight(moment(image.CreationDate).format('MMMM DD YYYY, hh:mm a'), 25, ' '),
        _.padRight(chalk.blue(image.Platform || 'linux'), 25, ' '),
        _.padRight(chalk.blue(image.OwnerId), 25, ' '),
        _.padRight(chalk.blue(image.State), 30, ' ')
      );
      // iterate over each volume snapshot
      _.forEach(image.BlockDeviceMappings, function(snapshot, key) {
        // store details of each snapshot for a summary
        if (snapshot.Ebs.VolumeType == 'gp2') {
          totalStoredGp2 += snapshot.Ebs.VolumeSize;
        } else if (snapshot.Ebs.VolumeType = 'io1') {
          totalStoredIo1 += snapshot.Ebs.VolumeSize;
          totalStoredIops += (snapshot.Ebs.Iops > 0 ? snapshot.Ebs.Iops : 0);
        }
        // print details of each snapshot if details option was passed
        if (detailedPrint) {
          console.log(
            _.padRight('', 10, ' '),
            _.padRight(chalk.green(snapshot.DeviceName), 25, ' '),
            _.padRight(chalk.green(snapshot.Ebs.SnapshotId), 25, ' '),
            _.padRight(chalk.red(snapshot.Ebs.VolumeSize), 15, ' '),
            _.padRight(chalk.blue(snapshot.Ebs.VolumeType), 15, ' '),
            _.padRight(chalk.blue(snapshot.Ebs.Iops | ''), 10, ' '),
            _.padRight(chalk.yellow(snapshot.Ebs.Encrypted ? 'Encrypted' : 'Not Encrypted'), 10, ' ')
          );
        }
      });


    });
    // print volume snapshot summary
    console.log('total stored EBS volumes %s - estimated cost: %s',
      (totalStoredGp2 + totalStoredIo1),
      (totalStoredGp2 + totalStoredIo1) * 0.095
    );
  }

};
