const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
    lessorService,
    tokenService,
    accountService,
    imageService,
} = require('../services');
const { sendSuccess, sendError } = require('./return.controller');
const httpStatus = require('http-status');
const { isEmpty } = require('lodash');

const identifyPhoneNumber = catchAsync(async (req, res) => {
    const id = req.user._id;
    const identify = await lessorService.identifyPhoneNumber(req.body);
    const verifyOTPToken = await tokenService.generateVerifyOTPToken(
        id,
        identify.otp
    );
    sendSuccess(res, verifyOTPToken, httpStatus.OK, 'send OTP successfully');
});

const createLessor = catchAsync(async (req, res) => {
    const id = req.user._id;
    const token = req.body.token;
    const otp = req.body.otp;
    const checkOtp = await tokenService.checkOtp(token, otp);
    if (checkOtp) {
        const lessor = await lessorService.createLessor(id);
        return sendSuccess(
            res,
            { lessor },
            httpStatus.CREATED,
            'lessor created'
        );
    }
    return sendError(res, httpStatus.BAD_REQUEST, 'Sai mã OTP');
});

const getListArticles = catchAsync(async (req, res) => {
    const id = req.user._id;
    const query = req.query;
    const articles = await lessorService.getListArticle({ id, ...query });
    if (!articles) {
        return sendError(
            res,
            httpStatus.BAD_REQUEST,
            'Không có bài đăng tin nào'
        );
    }
    return sendSuccess(res, articles, httpStatus.OK, 'Lấy list thành công');
});

const uploadIDCard = catchAsync(async (req, res) => {
    const id = req.user._id;
    const image = await imageService.addImage(req.file);
    const account = await accountService.updateIDCard(id, image.data);
    sendSuccess(res, account, httpStatus.OK, 'Cập nhật ID Card thành công');
});

const paymentMemberPackage = catchAsync(async (req, res) => {
    const lessorId = req.user._id;
    const result = await lessorService.paymentMemberPackage(req, lessorId, req.body);
    if (result.status != 200) {
        return sendError(res, result.status, result.message);
    }
    return sendSuccess(res, result.data, result.status, result.message);
})
const savePaymentResult = catchAsync(async (req, res) => {
    const result = await lessorService.savePaymentResult(req.query);
    if (result.status != 200) {
        return sendError(res, result.status, result.message);
    }
    return sendSuccess(res, result.data, result.status, result.message);
})

module.exports = {
    identifyPhoneNumber,
    getListArticles,
    createLessor,
    uploadIDCard,
    paymentMemberPackage,
    savePaymentResult
};
