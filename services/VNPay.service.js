const config = require("../config/config");
const moment = require('moment');

const payment = async (req, body) => {
  console.log(body);
  try {
    let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const transactions = body.amount * 100;
    console.log(transactions);
    //   body.typeOrders == defaultTypeOrders.POINT
    //     ? `?price=${transactions}&idUser=${body.idUser}&point=${body.point}&typeOrders=${body.typeOrders}`
    // const external_return_url =  `?price=${transactions}&idPoster=${body.idPoster}&postID=${body.postID}`;
    const external_return_url = "";

    let tmnCode = config.vnpay.vnp_TmnCode;
    let secretKey = config.vnpay.vnp_HashSecret;
    let vnpUrl = config.vnpay.vnp_Url;
    let returnUrl = config.vnpay.vnp_ReturnUrl;
    console.log(tmnCode);
    console.log(secretKey);
    console.log(vnpUrl);
    console.log(returnUrl);
    let date = new Date();
    console.log("date", date)
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    console.log("createDate", createDate)
    //var createDate = dateFormat(date, "yyyymmddHHmmss");
    let bankCode = body.bankCode;
    let orderId = moment(date).format('HHmmss');
    console.log("orderId", orderId)
    let orderInfo = body.orderDescription;
    let orderType = body.typeOrders;
    let locale = body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.0.1";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = parseInt(transactions, 10);
    vnp_Params["vnp_ReturnUrl"] = returnUrl + external_return_url;
    vnp_Params["vnp_IpAddr"] = "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    let sha256 = require("sha256");
    //var crypto = require("crypto");     
    // let hmac = crypto.createHmac("sha512", secretKey);
    // let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    let secureHash = sha256(signData);
    vnp_Params["vnp_SecureHashType"] = "SHA256";
    //vnp_Params["vnp_SecureHash"] = signed;
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });
    console.log("VNP:", vnp_Params);
    return {
      message: "Successfully redirect link payment",
      success: true,
      data: { code: "00", url: vnpUrl },
    };
  } catch (error) {
    console.log(error);
    return { message: "An error occurred", success: false };
  }
};

const VNPayReturn = async (body) => {
  try {
    let vnp_Params = {
      vnp_Amount: body.vnp_Amount,
      vnp_BankCode: body.vnp_BankCode,
      vnp_BankTranNo: body.vnp_BankTranNo,
      vnp_CardType: body.vnp_CardType,
      vnp_OrderInfo: body.vnp_OrderInfo,
      vnp_PayDate: body.vnp_PayDate,
      vnp_ResponseCode: body.vnp_ResponseCode,
      vnp_TmnCode: body.vnp_TmnCode,
      vnp_TransactionNo: body.vnp_TransactionNo,
      vnp_TransactionStatus: body.vnp_TransactionStatus,
      vnp_TxnRef: body.vnp_TxnRef,
      vnp_SecureHashType: body.vnp_SecureHashType,
      vnp_SecureHash: body.vnp_SecureHash,
    };

    const idPackageTemp = body.idPackageTemp;
    const typeCart = body.typeCart;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = this.sortObject(vnp_Params);

    let secretKey = vnp_HashSecret;

    let querystring = require("qs");
    let signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    let sha256 = require("sha256");

    let checkSum = sha256(signData);

    if (secureHash === checkSum) {
    }

  } catch (e) {
    console.log(e);
    return { message: "An error occurred", success: false };
  }
};

const sortObject = (o) => {
  let sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
};

module.exports = {
  payment,
  VNPayReturn,
  sortObject
}
