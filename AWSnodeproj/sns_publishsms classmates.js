var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-west-2'});

// Create publish parameters
var params = {
  Message: 'SAMPLE MESSAGE FROM nodeJS', /* required */
  PhoneNumber: '+918667247094'
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