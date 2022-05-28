const https = require('https');
const crypto = require('crypto');
const config = require('../config/config');

const paymentWithMomo = async () => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = "MOMO5J4720220527";
  var accessKey = "1blLSTSnxiWGuWq8";
  var secretkey = "GUkWgoNWTsA86OrgekdHYV4duZnu8vf7";
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = "pay with MoMo";
  var redirectUrl = "http:localhost:5000/api/payment/save-payment-momo";
  var ipnUrl = "https://callback.url/notify";
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  var amount = 50000;
  var requestType = "captureWallet"
  var extraData = ""; //pass empty value if your merchant does not have stores

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  var signature = crypto.createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'en'
  });
  //Create the HTTPS objects
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  }
  //Send the request and get the response
  const req = https.request(options, res => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (body) => {
      console.log('Body: ');
      console.log(body);
      console.log('payUrl: ');
      console.log(JSON.parse(body).payUrl);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  })

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log("Sending....")
  req.write(requestBody);
  req.end();
}
const savePaymentMomo = async(data) => {
  try {
    console.log(data);
    return {
      data: '',
      status: 200,
      message: 'Thanh toán thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Thanh toán thất bại'
    }
  }
}
module.exports = {
  paymentWithMomo,
  savePaymentMomo,
}

