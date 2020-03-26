// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set region
AWS.config.update({
  "accessKeyId": process.env.AWS_SDK_ACCESS_KEY_ID,
  "secretAccessKey": process.env.AWS_SDK_SECRET_ACCESS_KEY,
  "region": process.env.AWS_SDK_REGION
});

module.exports = sendSmsOTP = (pin, phone) => {
  // Create publish parameters
  const params = {
    Message: 'Your pin is ' + pin, /* required */
    PhoneNumber: phone // ? phone : '+6285693338168',
  };

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

  // Handle promise's fulfilled/rejected states
  return publishTextPromise

}

  // .then((data) => {
  //   console.log("MessageID is " + data.MessageId);
  // })
  // .catch((err) => {
  //   console.error(err, err.stack);
  // });
