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
  const {type,articleId, paymentId} = result;
  console.log("result", result)
  res.writeHead(301, {
    Location: `https://weeta-housing.vercel.app/thanh-toan-thanh-cong/type=SERVICEPACKAGE&articleId=${articleId}&paymentId=${paymentId}`
  }).end();
  // if(type === 'SERVICEPACKAGE'){
  //   res.writeHead(301, {
  //     Location: `https://weeta-housing.vercel.app/thanh-toan-thanh-cong/type=SERVICEPACKAGE&articleId=${articleId}&paymentId=${paymentId}`
  //   }).end();
  // }
  // if(type === 'MEMBERPACKAGE') {
  //   res.writeHead(301, {
  //     Location: `https://weeta-housing.vercel.app/thanh-toan-thanh-cong/type=${MEM}&articleId=${arti}&paymentId=${}`
  //   }).end();
  // }
  
})

module.exports = {
  paymentPackage,
  savePaymentResult
}