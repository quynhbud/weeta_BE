const catchAsync = require('../utils/catchAsync');
const PaymentPackageService = require('../services/payment.service');
const { lessorService, articleService } = require('../services');
const MomoService = require('../services/momo.service');
const { sendSuccess, sendError } = require('./return.controller');
const httpStatus = require('http-status');

const paymentPackage = catchAsync(async (req, res) => {
    const lessorId = req.user._id;
    // Nếu gói thành viên là FREE
    if (
        req.body.type === 'MEMBERPACKAGE' &&
        req.body.memberPackageName === 'FREE'
    ) {
        const lessor = await lessorService.updateLessor(lessorId, {
            memberPackage: 'FREE',
            articleTotal: 3,
        });
        return sendSuccess(
            res,
            lessor,
            httpStatus.OK,
            'Đã cập nhật gói thành viên'
        );
    }
    // Nếu gói tin là COMMON
    if (
        req.body.type === 'SERVICEPACKAGE' &&
        req.body.servicePackageName === 'COMMON'
    ) {
        // Nếu gói tin đã được published
        // const article = await articleService.getArticleById(req.body.articleId);
        // if(!article) return sendError(res, httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
        // if(article.isPublished) return sendError(res, httpStatus.BAD_REQUEST, 'Bài viết đã được đăng');
        const result = await articleService.updateArticleById(
            req.body.articleId,
            {
                servicePackage: 'COMMON',
                servicePackageId: '623d886f3d13700751208a7f',
                isPublished: true,
            }
        );
        return sendSuccess(res, result, httpStatus.OK, 'Đã cập nhật gói tin');
    }
    // Còn lại
    const result = await PaymentPackageService.paymentPackage(
        req,
        lessorId,
        req.body
    );
    if (result.status != 200) {
        return sendError(res, result.status, result.message);
    }
    return sendSuccess(res, result.data, result.status, result.message);
});

const paymentWithMomo = catchAsync(async (req, res) => {
    const lessorId = req.user._id;
    const result = await PaymentPackageService.paymentWithMomo(
        req.body,
        lessorId
    );
    // console.log("result", result)
    // if (result.status != 200) {
    //     return sendError(res, result.status, result.message);
    // }
    // return sendSuccess(res, result.data, result.status, result.message);
});
const savePaymentMomo = catchAsync(async (req, res) => {
    const result = await PaymentPackageService.savePaymentMomo(req.query);
    if (result.status != 200) {
        return sendError(res, result.status, result.message);
    }
    const { type, articleId, paymentId } = result;
    if (type === 'SERVICEPACKAGE') {
        res.writeHead(301, {
            Location: `https://weeta-housing.netlify.app/thanh-toan-thanh-cong/?type=SERVICEPACKAGE&articleId=${articleId}&paymentId=${paymentId}`,
        }).end();
    }
    if (type === 'MEMBERPACKAGE') {
        res.writeHead(301, {
            Location: `https://weeta-housing.netlify.app/thanh-toan-thanh-cong/?type=MEMBERPACKAGE&paymentId=${paymentId}`,
        }).end();
    }
});

const savePaymentResult = catchAsync(async (req, res) => {
    const result = await PaymentPackageService.savePaymentResult(req.query);
    if (result.status != 200) {
        return sendError(res, result.status, result.message);
    }
    const { type, articleId, paymentId } = result;
    if (type === 'SERVICEPACKAGE') {
        res.writeHead(301, {
            Location: `https://weeta-housing.netlify.app/thanh-toan-thanh-cong/?type=SERVICEPACKAGE&articleId=${articleId}&paymentId=${paymentId}`,
        }).end();
    }
    if (type === 'MEMBERPACKAGE') {
        res.writeHead(301, {
            Location: `https://weeta-housing.netlify.app/thanh-toan-thanh-cong/?type=MEMBERPACKAGE&paymentId=${paymentId}`,
        }).end();
    }
});

module.exports = {
    paymentPackage,
    paymentWithMomo,
    savePaymentResult,
    savePaymentMomo,
};
