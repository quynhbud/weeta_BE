const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { accountService, tokenService, emailService, authService } = require('../services');
const { sendSuccess } = require('./return.controller');

const createAccount = catchAsync(async (req, res) => {
  const user = await accountService.createAccount(req.body);
  const token = await tokenService.generateAuthTokens(user);
  const emailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, emailToken);
  // res.status(httpStatus.CREATED).send(user);
  sendSuccess(res, token, httpStatus.CREATED, 'User created');
});

const getAccount = catchAsync(async(req,res) => {
  const account = await accountService.getAccount();
  sendSuccess(res, { account }, httpStatus.CREATED, 'get account successfully');
});

const getAccountById = catchAsync(async(req,res) => {
  console.log(req.params.id)
  const accountId = req.params.id;
  const account = await accountService.getAccountById(accountId);
  sendSuccess(res, { account }, httpStatus.CREATED, 'get account successfully');
})
module.exports = {
  getAccount,
  createAccount,
  getAccountById,
}