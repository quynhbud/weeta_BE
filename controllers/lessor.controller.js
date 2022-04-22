const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { lessorService, tokenService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');
const httpStatus = require('http-status');

const identifyPhoneNumber = catchAsync(async (req, res) => {
  const id = req.user._id;
  const identify = await lessorService.identifyPhoneNumber(req.body);
  const verifyOTPToken = await tokenService.generateVerifyOTPtoken(
    id,identify.otp
  );
  sendSuccess(res, verifyOTPToken, httpStatus.OK, 'send OTP successfully');
});

const createLessor = catchAsync(async (req, res) => {
  const id = req.user._id
  const token = req.body.token;
  const otp = req.body.otp;
  const checkOtp = await tokenService.checkOtp(token, otp);
  if(checkOtp){
    const lessor = await lessorService.createLessor(id);
    return sendSuccess(res, { lessor }, httpStatus.CREATED, 'lessor created');
  }
  return sendError(res, httpStatus.BAD_REQUEST, "Sai mã OTP");
});



module.exports = {
  identifyPhoneNumber,
  createLessor,
};
