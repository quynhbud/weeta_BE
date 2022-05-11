const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { accountService, tokenService, emailService, authService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

const createAccount = catchAsync(async (req, res) => {
  const user = await accountService.createAccount(req.body);
  if(user.status === 400){
    return sendError(res, user.status, user.message);
  }
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
  const accountId = req.params.id;
  const account = await accountService.getAccountById(accountId);
  sendSuccess(res, { account }, httpStatus.CREATED, 'get account successfully');
})

const saveArticle = catchAsync(async (req, res) => {
  const articleId = req.params.articleId;
  const accountId = req.user._id;
  const result = await accountService.saveArticle(articleId, accountId);
  if(result.status !== 200) {
    return sendError(res, result.status, result.messaage);
  }
  return sendSuccess(res, result.data, result.status, result.message );
})
module.exports = {
  getAccount,
  createAccount,
  getAccountById,
  saveArticle,
}