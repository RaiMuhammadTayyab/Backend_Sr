// server/sendSMS.js
// server/sendSMS.js

require('dotenv').config();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const accountSid = 'your_twilio_account_sid';
const authToken = 'your_auth_token';
//const client = new twilio(accountSid, authToken);

const sendOrderSMS = async (toNumber, message) => {
  await client.messages.create({
    body: message,
    from: '+17655655912', // your Twilio number
    to: toNumber
  });
};

module.exports = sendOrderSMS;




