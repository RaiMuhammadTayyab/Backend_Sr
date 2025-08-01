const express = require('express');
const router = express.Router();
const updateStock = require("../controller/UpdatingStock");
const customer=require("../controller/Customer")
const Bulkdata=require("../controller/Bulkdata")
const Form=require("../controller/Singleform")
const alldata=require("../controller/alldata")
router.post("/:collectionName/Placeorder", updateStock);
router.post("/:collectionName/addcustomer",customer);
router.post("/:collectionName/addData",Bulkdata)
router.post("/:collectionName/adddata",Form)
router.get("/:collectionName/getdata",alldata)

router.get("/test", (req, res) => {
  res.send("✅ Router working");
});
module.exports = router;






//const sendSMS = require('../controller/SendSMS');
//const sendEmail = require('../sendEmail');
/*const formatPhoneNumber = (number) => {
  // Replace leading 0 with +92 (Pakistan country code)
  if (number.startsWith('0')) {
    return '+92' + number.slice(1);
  }
  return number; // already in correct format
};
router.post('/send-sms', async (req, res) => {
  const { name,phone, TotalAmount,totalItems}=req.body 
 const formattedPhone = formatPhoneNumber(phone);
  try {
    await sendSMS(formattedPhone, `Hi ${name}, your order was received having ${totalItems}${totalItems > 1 ? "items" : "item"}amounting to ${TotalAmount}.`);
    res.status(200).json({ success: true, message: 'SMS sent' });
  } catch (err) {
    console.error("❌ Failed to send SMS:", err.message);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});
*/



