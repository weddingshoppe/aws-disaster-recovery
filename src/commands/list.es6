var _                 = require('lodash');
var chalk             = require('chalk');

module.exports = function list(filter, options, aws) {
  console.log('list works');
  console.log('filter is: ' + filter);
  //console.log(JSON.stringify(options, null, 4));
  var params = {
    DryRun: false
    //,
    //Filters: [
    //  {
    //    Name: 'tag-key',
    //    Values: [
    //      'Name'
    //    ]
    //  },
    //  {
    //    Name: 'tag-value',
    //    Values: [
    //      filter
    //    ]
    //  }
    //],
    //InstanceIds: [
    //  'STRING_VALUE',
    //  /* more items */
    //],
    //MaxResults: 0,
    //NextToken: '123456'
  };

  var ec2 = new aws.EC2();

  ec2.describeInstances(params, function(err, data) {
    if (err) {
      // an error occurred
      console.log(err, err.stack);
    }
    else {
      // successful response
      //console.log(data);
      console.log('calling describeInstances was successful');

      _.forEach(data.Reservations, function(n, key) {
        //console.log('n is: ' + n);
        //console.log(n, key);
        //console.log('key is: ' + key);
        //console.log('n.ReservationId is: ' + n.ReservationId);
        _.forEach(n.Instances, function(instance, key) {
          console.log(
            _.padRight(chalk.orange(instance.InstanceId), 14, ' '),
            _.padRight(chalk.red(instance.KeyName), 25, ' '),
            _.padRight(chalk.blue(instance.PublicIpAddress), 20, ' '),
            instance.State.Name
          );
          //console.log(instance.State);
          //console.log('instance key is: ' + key);
          //console.log('instance is: ' + instance);
          //console.log('instance id is: ' + instance.InstanceId);
        });
      });
    }
  });
};
