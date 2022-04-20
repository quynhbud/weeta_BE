const httpStatus = require('http-status');
const { random } = require('lodash');
const { Account, Lessor } = require('../models/index');
const AppError = require('../utils/appError');
const SendSMSService = require('./sendSMS.service');

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math
  .random() * (maxm - minm + 1)) + minm;
}
const identifyPhoneNumber =  async (lessorBody) => {
  const otp = generateRandomNumber();
  const body = {
    message: `Weeta - ma xac thuc so dien thoai cua ban la: ${otp}`,
    phoneNumber: lessorBody.phoneNumber
  }
  const sendSMS = await SendSMSService.sendSMS(body);
  return {
    message: sendSMS,
    otp: otp,
  }
}

const createLessor = async (lessorBody) => {
  if (!await Account.isPhoneTaken(lessorBody.phoneNumber)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Phone number not already exists');
  }
  const account = Account.findOne({phoneNumber: lessorBody.phoneNumber});
  const lessor = {
    lessorId: account._id,
    memberPackageId:lessorBody.memberPackageId,
  } 
  await Account.updateOne({phoneNumber:lessorBody.phoneNumber },{role: 'LESSOR'});
  return Lessor.create(lessor);
};

module.exports = {
  identifyPhoneNumber,
  createLessor,
};
