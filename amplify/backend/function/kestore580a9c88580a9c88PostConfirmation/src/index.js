/*
  this file will loop through all js modules which are uploaded to the lambda resource,
  provided that the file names (without extension) are included in the "MODULES" env variable.
  "MODULES" is a comma-delimmited string.
*/
/*
exports.handler = (event, context, callback) => {
  const modules = process.env.MODULES.split(',');
  for (let i = 0; i < modules.length; i += 1) {
    const { handler } = require(`./${modules[i]}`);
    handler(event, context, callback);
  }
};
*/

const aws = require('aws-sdk');
const ddb = new aws.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = (event, context, callback) => {
  console.log(event);
  
  const tableName = process.env.TABLE_NAME;

  if(event.request.userAttributes.sub) {
    var ddbParams = {
      TableName: tableName,
      Item: {
        'id': {"S" : event.userName},
        'name': {"S" : event.request.userAttributes.name},
        'destination': null,
        'email': {"S" : event.request.userAttributes.email},
        'phoneNum': {"S" : event.request.userAttributes.phone_number},
        'birthdate': {"S" : event.request.userAttributes.birthdate},
        'gender': {"S" : event.request.userAttributes.gender},
        'point': {"S" : event.request.userAttributes['custom:init_point']}
      }
    };
  
    console.log(ddbParams);
    
    ddb.putItem(ddbParams, function(err, data) {
      if(err) {
        console.log("Error: "+err);
      } else {
        console.log("Data: "+data);
      }
    });
    
    callback(null, event);
  } else {
    console.log("Error: Nothing was written to DDB");
    callback(null, event);
  }

};