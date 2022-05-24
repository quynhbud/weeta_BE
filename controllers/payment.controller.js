const catchAsync = require('../utils/catchAsync');
const  PaymentPackageService = require('../services/payment.service');
const { sendSuccess, sendError } = require('./return.controller');

const paymentPackage = catchAsync(async (req, res) => {
  const lessorId = req.user._id;
  const result = await PaymentPackageService.paymentPackage(req, lessorId, req.body);
  if (result.status != 200) {
    return sendError(res, result.status, result.message);
  }
  return sendSuccess(res, result.data, result.status, result.message);
})

const savePaymentResult = catchAsync(async (req, res) => {
  const result = await PaymentPackageService.savePaymentResult(req.query);
  if (result.status != 200) {
    return sendError(res, result.status, result.message);
  }
  res.writeHead(301, {
    Location: `http://google.com`
  }).end();
})

module.exports = {
  paymentPackage,
  savePaymentResult
}