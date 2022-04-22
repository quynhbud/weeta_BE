const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONENUMBER;

const client = new twilio(accountSID, authToken);
const sendSMS = (data) => {
  client.messages
  .create({
    body: data.message,
    to: data.phoneNumber,
    from: phoneNumber,
  });
  return (`The message with was sent!`)
}

module.exports = {
  sendSMS
}
