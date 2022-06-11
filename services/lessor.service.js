const {
    Account,
    Article,
    Lessor,
    MemberPackageTransaction,
    ServicePackageTransaction,
} = require('../models/index');
const SendOTPService = require('./sendOTP.service');
const { isEmpty } = require('lodash');
const AppError = require('../utils/appError');
const httpStatus = require('http-status');

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
        account: id,
    };
    await Account.updateOne({ _id: id }, { role: 'lessor' });
    return Lessor.create(lessor);
};

const updateLessor = async (id, data) => {
    const lessor = await Lessor.findById(id);
    if (!lessor)
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Người cho thuê không tồn tại'
        );
    Object.assign(lessor, data);
    return await lessor.save();
};

const getListArticle = async (data) => {
    try {
        const { page, limit, id, keyword, ...rest } = data;
        const currentPage = page || 1;
        const currentLimit = limit || 10;
        const skip = (currentPage - 1) * currentLimit;
        const articles = await Article.find({
            lessor: id,
            title: { $regex: keyword || '', $options: 'i' },
            ...rest,
        })
            .populate(
                'lessor',
                '_id fullname email phoneNumber avatar createdAt isAutoApproved'
            )
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(currentLimit)
            .exec();
        const total = await Article.find({
            lessor: id,
            title: { $regex: keyword || '', $options: 'i' },
            ...rest,
        }).count();
        return {
            data: {
                articles,
                total,
            },
            status: 200,
            message: 'Lấy danh sách tin cho thuê thành công',
        };
    } catch {
        return {
            status: 500,
            message: 'Lấy danh sách tin cho thuê không thành công',
        };
    }
};

const getListTransaction = async (data, lessorId) => {
    const { page, limit, type } = data;
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const skip = (currentPage - 1) * currentLimit;
    if (type === 'MEMBERPACKAGE') {
        const transactions = await MemberPackageTransaction.find({
            lessorId: lessorId,
        })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(currentLimit)
            .exec();
        const total = await MemberPackageTransaction.find({
            lessorId: lessorId,
        }).count();

        let isOver = false;
        if (currentPage * limit >= total || isEmpty(transactions)) {
            isOver = true;
        }
        return {
            transactions,
            total,
            isOver,
        };
    }
    if (type === 'SERVICEPACKAGE') {
        const transactions = await ServicePackageTransaction.find({
            lessorId: lessorId,
        })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(currentLimit)
            .exec();
        const total = await ServicePackageTransaction.find({
            lessorId: lessorId,
        }).count();
        let isOver = false;
        if (currentPage * limit >= total || isEmpty(transactions)) {
            isOver = true;
        }
        return {
            transactions,
            total,
            isOver,
        };
    }
};

module.exports = {
    identifyPhoneNumber,
    createLessor,
    getListArticle,
    getListTransaction,
    updateLessor,
};
