const csv = require('csv-parser');  
const fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var i = new Number(0);
fs.createReadStream('contacts.csv')  
  .pipe(csv())
  .on('data', (row) => {
    var name = row.Name;
    var number = row['Phone 1 - Value'];
    if(name.slice(name.length-9,name.length)=='Classmate')
    {
      //console.log("LOG : CLASSMATE DETECTED...:")
      //console.log('Classmate number :'+i)
      //i = i + 1;
      //console.log(name)
      //console.log(number);
      var k = 0;
      while(number[k]!=':' && k<number.length){
        k = k + 1;
      }
      number = number.slice(0,k);
      if(number[0]!='+')
      {
      //  console.log('Adding +91 ...')
        number = '+91'+number;
      }
      //console.log("Changed number : "+number+"\n");
      var params = {
        Message: 'THIS IS A TEST MESSAGE DEPLOYED BY ONE OF THE SOFTWARE ENGINEERING TEAMS IN YOUR CLASS. PLEASE DON\'T MIND US INTRUDING YOUR PRIVACY :P.', /* required */
        PhoneNumber: number
      };
      console.log(params);

      var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
    function(data) {
        console.log("SMS Sent to "+name+"! MessageID is " + data.MessageId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
    });

    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });