const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const accountService = require('./account.service');
const { Token } = require('../models');
const AppError = require('../utils/appError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {Account} account
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (account) => {
    const accessTokenExpires = moment
        .utc()
        .add(7, 'hours')
        .add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(
        account.id,
        accessTokenExpires,
        tokenTypes.ACCESS
    );
    return accessToken;
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveToken = async (data) => {
    const tokenDoc = await Token.create({
        token: data.token,
        user: data.user,
        otp: data.otp,
        expires: data.expires.toDate(),
        type: data.type,
    });
    return tokenDoc;
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
    const user = await accountService.getAccountByEmail(email);
    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No users found with this email'
        );
    }
    const expires = moment
        .utc()
        .add(7, 'hours')
        .add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(
        user.id,
        expires,
        tokenTypes.RESET_PASSWORD
    );
    const data = {
        token: resetPasswordToken,
        user: user.id,
        expires: expires,
        type: tokenTypes.RESET_PASSWORD,
    };
    await saveToken(data);
    return resetPasswordToken;
};

const generateVerifyOTPToken = async (id, otp) => {
    const user = await accountService.getAccountById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No users found');
    }
    const expires = moment
        .utc()
        .add(7, 'hours')
        .add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const verifyOTPToken = generateToken(id, expires, tokenTypes.VERIFY_OTP);
    const data = {
        token: verifyOTPToken,
        user: id,
        otp: otp,
        expires: expires,
        type: tokenTypes.VERIFY_OTP,
    };
    await saveToken(data);
    return verifyOTPToken;
};

/**
 * Generate verify email token
 * @param {Account} account
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (account) => {
    const expires = moment
        .utc()
        .add(7, 'hours')
        .add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(
        account.id,
        expires,
        tokenTypes.VERIFY_EMAIL
    );
    const data = {
        token: verifyEmailToken,
        user: account.id,
        expires: expires,
        type: tokenTypes.VERIFY_EMAIL,
    };
    await saveToken(data);
    return verifyEmailToken;
};

const checkOtp = async (token, otp) => {
    const tokenOtp = await Token.findOne({ token: token });
    const success = tokenOtp.otp == Number(otp) ? true : false;
    return success;
};

module.exports = {
    checkOtp,
    generateToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
    generateVerifyOTPToken,
};
