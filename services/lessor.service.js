const httpStatus = require('http-status');
const { random } = require('lodash');
const Article = require('../models/article.model');
const { Account, Lessor } = require('../models/index');
const AppError = require('../utils/appError');
const SendOTPService = require('./sendOTP.service');

function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
const identifyPhoneNumber = async (lessorBody) => {
    const otp = generateRandomNumber();
    const body = {
        message: `${otp} là mã OTP của bạn. Vui lòng không cung cấp OTP này cho người khác`,
        phoneNumber: lessorBody.phoneNumber,
    };
    const sendOTP = await SendOTPService.sendSMS(body);
    return {
        message: sendOTP,
        otp: Number(otp),
    };
};

const createLessor = async (id) => {
    const lessor = {
        lessorId: id,
    };
    await Account.updateOne({ _id: id }, { role: 'lessor' });
    return Lessor.create(lessor);
};

const getListArticle = async (data) => {
    const { page, limit, id, keyword, ...rest } = data;
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const skip = (currentPage - 1) * currentLimit;
    const articles = await Article.find({
        lessor: id,
        title: { $regex: keyword || '', $options: 'i' },
        ...rest,
    })
        .skip(skip)
        .limit(currentLimit)
        .exec();
    const total = await Article.find({
        lessor: id,
        title: { $regex: keyword || '', $options: 'i' },
        ...rest,
    }).count();
    return {
        articles,
        total,
    };
};

const paymentMemberPackage = async (req, lessorId, data) => {
    // const saveData = {
    //     lessorId: lessorId,
    //     memberPackageName: data.memberPackageName,
    //     transactionAmount: data.prices,
    //     status: 'WAITFORPAYMENT',
    // }
    // const transaction = await MemberPackageTransaction.create(saveData);
    // const orderDescription = `${data.memberPackageName}-${lessorId}-${transaction.transactionId}-${data.lessorId}`
    // const transactionData = {
    //     typeOrders: "payment",
    //     amount: `${~~data.prices}`,
    //     bankCode: "NCB",
    //     orderDescription: orderDescription,
    //     language: "vn",
    //     typeCart: 'CLIENT',
    //     //servicePackage: data.servicePackageId,
    //     lessor: lessorId,
    // };
    // const resultPayment = await VNPayService.payment(
    //     req,
    //     transactionData,
    // );
    // if (resultPayment.success) {
    //     return {
    //         success: true,
    //         message: "Thanh toán thành công",
    //         data: resultPayment.data.url,
    //         status: 200,
    //     };
    // } else {
    //     return {
    //         success: false,
    //         message: "Thanh toán thất bại",
    //         data: resultPayment.data.url,
    //         status: 200,
    //     };
    // }
}

module.exports = {
    identifyPhoneNumber,
    createLessor,
    getListArticle,
    paymentMemberPackage,
};
