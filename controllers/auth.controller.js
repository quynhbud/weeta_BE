const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('./return.controller');
const { authService, tokenService, emailService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  const { role } = user;
  sendSuccess(res, { token, role, userId: user._id }, httpStatus.OK, 'Đăng nhập thành công');
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  sendSuccess(res, { token: resetPasswordToken }, httpStatus.OK, 'Reset email sent');
});

const changePassword = catchAsync(async (req, res) => {
  console.log(req.user._id);
  await authService.changePassword(req.user._id, req.body);
  sendSuccess(res, {}, httpStatus.OK, 'Cập nhật thành công');
});

module.exports = {
  login,
  changePassword,
  forgotPassword,
}