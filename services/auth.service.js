const httpStatus = require('http-status');
const tokenService = require('./token.service');
const accountService = require('./account.service');
//const businessService = require('./business.service');
const emailService = require('./email.service');
const { Token } = require('../models');
const AppError = require('../utils/appError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await accountService.getAccountByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Sai email hoặc mật khẩu');
  }
  if (!(await accountService.checkVerifyEmail(user._id))) throw new AppError(httpStatus.UNAUTHORIZED, 'Chưa xác nhận email');
  if (!(await accountService.checkIsActive(user._id))) throw new AppError(httpStatus.UNAUTHORIZED, 'Tài khoản đang bị chặn');
  return user;
};

/**
 * Reset password
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise}
 */
const changePassword = async (userId, updateBody) => {
  const { oldPassword, newPassword } = updateBody;
  const account = await accountService.getAccountById(userId);
  if (!account) {
    throw new AppError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại');
  }
  if (!(await account.isPasswordMatch(oldPassword))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Sai mật khẩu');
  }
  await accountService.updateAccountById(account.id, { password: newPassword });
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await accountService.getAccountById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await accountService.updateAccountById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await accountService.getUserById(verifyEmailTokenDoc.user);
    if (!user || !verifyEmailTokenDoc) {
      throw new Error();
    } else {
      await accountService.updateUserById(user.id, { isEmailVerified: true });
      //   await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    }
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};



module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
  verifyEmail,
  changePassword,
};
