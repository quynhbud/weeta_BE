const httpStatus = require('http-status');
const { random } = require('lodash');
const Article = require('../models/article.model');
const { Account, Lessor, MemberPackageTransaction, MemberPackage } = require('../models/index');
const AppError = require('../utils/appError');
const SendOTPService = require('./sendOTP.service');
const VNPayService = require('./VNPay.service');

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

const updateMemberPackage = async (data) => {
    const memberPackage = await MemberPackage.findById(data.memberPackageId);
    const updateData = {
        memberPackageId: data.memberPackageId,
        articleTotal: memberPackage.articlePerMonth,
        articleUsed: 0,
    };
    await Lessor.updateOne({ account: data.accountId }, updateData);
    const updateLessor = await Lessor.findOne({account: data.accountId});
    return {
        data: updateLessor,
        message: 'Cập nhật gói thành viên người cho thuê thành công',
    };
}
const paymentMemberPackage = async (req, lessorId, data) => {
    const saveData = {
        lessorId: lessorId,
        memberPackageId: data.memberPackageId,
        transactionAmount: data.prices,
        status: 'WAITFORPAYMENT',
    }
    const transaction = await MemberPackageTransaction.create(saveData);
    const orderDescription = `${data.memberPackageId}-${transaction._id}-${lessorId}`
    const transactionData = {
        typeOrders: "payment",
        amount: `${~~data.prices}`,
        bankCode: "NCB",
        orderDescription: orderDescription,
        language: "vn",
        typeCart: 'CLIENT',
        //servicePackage: data.servicePackageId,
        lessor: lessorId,
    };
    const resultPayment = await VNPayService.payment(
        req,
        transactionData,
    );
    if (resultPayment.success) {
        return {
            success: true,
            message: "Thanh toán thành công",
            data: resultPayment.data.url,
            status: 200,
        };
    } else {
        return {
            success: false,
            message: "Thanh toán thất bại",
            data: resultPayment.data.url,
            status: 200,
        };
    }
}
const savePaymentResult = async(data) => {
    try {
        let vnp_Params = {
            vnp_Amount: data.vnp_Amount,
            vnp_BankCode: data.vnp_BankCode,
            vnp_BankTranNo: data.vnp_BankTranNo,
            vnp_CardType: data.vnp_CardType,
            vnp_OrderInfo: data.vnp_OrderInfo,
            vnp_PayDate: data.vnp_PayDate,
            vnp_ResponseCode: data.vnp_ResponseCode,
            vnp_TmnCode: data.vnp_TmnCode,
            vnp_TransactionNo: data.vnp_TransactionNo,
            vnp_TransactionStatus: data.vnp_TransactionStatus,
            vnp_TxnRef: data.vnp_TxnRef,
            vnp_SecureHashType: data.vnp_SecureHashType,
            vnp_SecureHash: data.vnp_SecureHash,
        };
        const memberPackageId = vnp_Params.vnp_OrderInfo.split('-')[0];
        const transactionId = vnp_Params.vnp_OrderInfo.split('-')[1];
        const accountId = vnp_Params.vnp_OrderInfo.split('-')[2];
        const reqData = {
            memberPackageId,
            transactionId,
            accountId,
        }
        if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
            const updateLessor = await updateMemberPackage(reqData);
            const updateTransaction = await MemberPackageTransaction.updateOne({ _id: transactionId }, { status: 'SUCCESS' })
            return {
                success: true,
                data: updateLessor.data,
                message: "Thanh toán thành công",
                status: 200,
            }
        }
        return {
            success: false,
            message: "Thanh toán thất bại",
            status: 300,
        }
    } catch {
        return {
            success: false,
            message: "Thanh toán thất bại",
            status: 500,
        }
    }
}

module.exports = {
    identifyPhoneNumber,
    createLessor,
    getListArticle,
    paymentMemberPackage,
    savePaymentResult,
    updateMemberPackage,
};
