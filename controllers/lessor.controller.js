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
    const result = await lessorService.getListArticle({ id, ...query });
    if (result.status !=200) {
        return sendError(
            res,
            httpStatus.BAD_REQUEST,
            result.message,
        );
    }
    return sendSuccess(res, result.data, httpStatus.OK, result.message);
});

const uploadIDCard = catchAsync(async (req, res) => {
    const id = req.user._id;
    const image = await imageService.addImage(req.file);
    const account = await accountService.updateIDCard(id, image.data);
    sendSuccess(res, account, httpStatus.OK, 'Cập nhật ID Card thành công');
});

const getListTransaction = catchAsync(async (req, res)=>{
    const lessorId = req.user._id;
    const result = await lessorService.getListTransaction(req.query, lessorId);
    if (!result) {
        return sendError(
            res,
            httpStatus.BAD_REQUEST,
            'Lỗi'
        );
    }
    return sendSuccess(res, result, httpStatus.OK, 'Lấy danh sách thanh toán thành công');
})

module.exports = {
    identifyPhoneNumber,
    getListArticles,
    createLessor,
    uploadIDCard,
    getListTransaction,
};
