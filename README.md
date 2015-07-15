# aws-disaster-recovery

a simple [scriptable] command line interface to make disaster recovery simple and automated with amazon web services (AWS)

project description
==========================
the initial scope for this project will be to automate image creation for instances within an AWS account.  

Support for not imaging an instance should be provided by checking for a tag on an instance designating that the instance should not be automatically imaged.

The roadmap includes developing functionality to also automate the restore process as there are many moving parts to this in practice but the initial scope will be automating backups first.

issues / project management
--------------------------------------
Issues: https://github.com/WeddingShoppe/aws-disaster-recovery/issues

Project board: https://waffle.io/WeddingShoppe/aws-disaster-recovery



## Example Usage
----

### backup all instances accessible to the account you are connecting with

`awsdr backup all`

### backup a specific instance

`awsdr backup instance i-12345`

### list all instances
`awsdr list`

### list all images (AMI's)
`awsdr list images`

project references
--------------------------------------
AWS Node API: http://aws.amazon.com/sdk-for-node-js/
AWS API Promisified: https://github.com/CascadeEnergy/aws-promised

## Installation

 * install node or iojs
 * install aws-disaster-recovery
 * set environment variables for aws API credentials
 * run `awsdr --help` or `awsdr --version` to verify it is installed.
