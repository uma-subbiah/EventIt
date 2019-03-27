var awsservices = require('./sns_publishsms')
var sendText = "HIII"
awsservices.sendSMS(sendText, 8667247094);