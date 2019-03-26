module.exports = {
  sendSMS: function(message, number){
  var AWS = require('aws-sdk');
  // Set region
  AWS.config.update({region: 'us-east-1'});
  //var args = process.argv.slice(2);
  //console.log(args);
  // Create publish parameters
  if(number[0]!='+'){
    number = '+91'+number;
  }
  var params = {
    Message: message, /* required */
    PhoneNumber: number
  };

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function(data) {
      console.log("SMS Sent! MessageID is " + data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
  }
}