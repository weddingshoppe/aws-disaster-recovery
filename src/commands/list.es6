var _ = require('lodash');

module.exports = function list(filter, options, aws) {
  console.log('list works');
  console.log('filter is: ' + filter);
  //console.log(JSON.stringify(options, null, 4));
  var params = {
    DryRun: false,
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
        console.log('key is: ' + key);
        console.log('n is: ' + n);
        _.forEach(n[key], function(m, keyM) {
          console.log('keyM is: ' + keyM);
          console.log('m is: ' + m[keyM]);
        });


      });



    }
  });
};