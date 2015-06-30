//module.exports = function(cli) {
//    cli.ui('args: '.red() + cli.args);
//
//    cli.ui('backup works'.green());
//}

module.exports = function backup(instanceid, options, aws) {
  console.log('backup works');
  console.log('instanceid is: ' + instanceid);
  console.log('options are: ' + options[0]);
};