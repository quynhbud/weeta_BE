const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess, sendError } = require('./return.controller');
const { authService, tokenService, emailService, accountService, imageService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if(user.status === 400) {
    return sendError(res,user.status,user.msg)
  }
  const token = await tokenService.generateAuthTokens(user);
  const { role } = user;
  sendSuccess(res, { token, role, userId: user._id }, httpStatus.OK, 'Đăng nhập thành công');
});

const forgotPassword = catchAsync(async (req, res) => {
  const email = req.params.email;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  sendSuccess(res, { token: resetPasswordToken }, httpStatus.OK, 'Reset email sent');
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  sendSuccess(res, {}, httpStatus.OK, 'Cập nhật thành công');
});
const getProfile = catchAsync(async (req, res) => {
  const profile = req.user;
  sendSuccess(res, profile, httpStatus.OK, 'Lấy thông tin thành công')
})
const updateProfile = catchAsync(async (req, res) => {
  const account = await accountService.updateAccountById(req.user._id, req.body);
  sendSuccess(res, account, httpStatus.OK, 'Cập nhật thành công');
});
const updateAvatar = catchAsync(async (req, res) => {
  const id = req.user._id;
  const image = await imageService.addImage(req.file)
  const account = await accountService.updateAvatar(id, image.data);
  sendSuccess(res, account, httpStatus.OK, 'Cập nhật thành công');
});
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  sendSuccess(res, {}, httpStatus.OK, 'Email confirmed');
});
module.exports = {
  login,
  updateProfile,
  updateAvatar,
  changePassword,
  forgotPassword,
  sendVerificationEmail,
  verifyEmail,
  getProfile
}