const httpStatus = require('http-status');
const { random } = require('lodash');
const { Account, Lessor } = require('../models/index');
const AppError = require('../utils/appError');
const {SendOTPService} = require('./sendOTP.service');

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math
  .random() * (maxm - minm + 1)) + minm;
}
const identifyPhoneNumber =  async (lessorBody) => {
  const otp = generateRandomNumber();
  const body = {
    message: ` OTP của bạn là: ${otp} - Vui lòng không cung cấp OTP này cho người khác`,
    phoneNumber: lessorBody.phoneNumber
  }
  const sendOTP = await SendOTPService.sendSMS(body);
  return {
    message: sendOTP,
    otp: Number(otp),
  }
}

const createLessor = async (id) => {
  const lessor = {
    lessorId: id
  } 
  await Account.updateOne({role: 'LESSOR'});
  return Lessor.create(lessor);
};

module.exports = {
  identifyPhoneNumber,
  createLessor,
};
