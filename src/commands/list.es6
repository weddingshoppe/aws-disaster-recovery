var _                 = require('lodash');
var chalk             = require('chalk');

module.exports = function list(options, aws) {
  //console.log('list works');
  //console.log('filter is: ' + filter);
  //console.log(JSON.stringify(options, null, 4));

  var params = {
    DryRun: false
  };

  var awsPromised = require('aws-promised');
  var ec2 = awsPromised.ec2();

  ec2.describeInstancesPromised(params)
  .then(printContents)
  .catch(console.error);

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

};
