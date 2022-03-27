const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { lessorService } = require('../services');
const { sendSuccess } = require('./return.controller');
const httpStatus = require('http-status');

const identifyPhoneNumber = catchAsync(async (req, res) => {
  const identify = await lessorService.identifyPhoneNumber(req.body);
  sendSuccess(res, {identify}, httpStatus.OK, 'send OTP successully');
})

const createLessor = catchAsync(async (req, res) => {
  const lessor = await lessorService.createLessor(req.body);
  // res.status(httpStatus.CREATED).send(user);
  sendSuccess(res, { lessor }, httpStatus.CREATED, 'lessor created');
});

module.exports = {
  identifyPhoneNumber,
  createLessor
}