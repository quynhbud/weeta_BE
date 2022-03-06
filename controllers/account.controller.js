const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { accountService } = require('../services');
const { sendSuccess } = require('./return.controller');

const createAccount = catchAsync(async (req, res) => {
  const user = await accountService.createAccount(req.body);
  // res.status(httpStatus.CREATED).send(user);
  sendSuccess(res, { user }, httpStatus.CREATED, 'User created');
});

const getAccount = catchAsync(async(req,res) => {
  const account = await accountService.getAccount();
  sendSuccess(res, { account }, httpStatus.CREATED, 'get account successfully');

})



module.exports = {
  getAccount,
  createAccount,
}