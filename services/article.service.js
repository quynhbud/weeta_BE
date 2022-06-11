const httpStatus = require('http-status');
const {
    Article,
    ServicePackage,
    Lessor,
    Account,
    ServicePackageTransaction,
    Location,
} = require('../models');
const { map, keyBy, isEmpty } = require('lodash');
const VNPayService = require('../services/VNPay.service');
const moment = require('moment');
const AppError = require('../utils/appError');

const createArticle = async (accountId, data, imageURLs) => {
    const currentTime = new Date();
    const lessor = await Lessor.findOne({ account: accountId });
    const account = await Account.findOne({ _id: accountId });
    if (account.role != 'lessor') {
        return {
            data: null,
            message: 'Bạn chưa trở thành người cho thuê',
        };
    }
    if (lessor.articleTotal === lessor.articleUsed) {
        return {
            data: null,
            message: 'Bạn không còn lượt đăng tin nào',
        };
    }
    const dataArticle = new Article({
        title: data.title,
        district: data.district,
        ward: data.ward,
        street: data.street,
        price: data.price,
        area: data.area,
        location: {
            latitude: data?.latitude || 0,
            longitude: data?.longtitude || 0,
        },
        description: data.description,
        lessor: accountId,
        image: imageURLs,
        servicePackageId: '623d886f3d13700751208a7f',
        isPublished: false,
        createdAt: currentTime,
        endDate: moment(currentTime).add(30, 'day').format(),
        startDateService: currentTime,
        endDateService: moment(currentTime).add(30, 'day').format(),
    });
    const newArticle = await Article.create(dataArticle);
    if (account.isAutoApproved) {
        await Article.updateOne({ _id: newArticle._id }, { isApproved: true });
    }
    const articleUsed = lessor.articleUsed + 1;
    await Lessor.updateOne(
        { account: accountId },
        { articleUsed: articleUsed }
    );
    const article = await Article.findOne({ _id: newArticle._id });
    return {
        data: article,
        message: 'Tạo bài đăng thành công',
    };
};
const getListArticle = async (data) => {
    data.isDeleted = false;
    data.isApproved = true;
    data.servicePackageId = {
        in: ['623d88663d13700751208a7e', '623d886f3d13700751208a7f'],
    };
    const page = data.page * 1 || 1;
    const limit = data.limit * 1 || 10;
    const skip = (page - 1) * limit;
    let searchField = data?.keyword || '';
    let keyword,
        articleIds = '';
    if (searchField) {
        searchField = removeVN(searchField);
        keyword = new RegExp(
            searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
            'i'
        );
        const listArticle = await Article.find();
        const articles = listArticle
            .map((article) => {
                if (removeVN(article.title).match(keyword)) {
                    return article;
                }
            })
            .filter((itm) => {
                return !isEmpty(itm);
            });
        articleIds = map(articles, 'id');
    }
    if (!isEmpty(articleIds)) {
        data._id = { in: articleIds };
    }
    const queryObj = data;
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
        /\b(gte|gt|lt|lte|in|regex|option)\b/g,
        (match) => `$${match}`
    );
    const queryString = JSON.parse(queryStr);
    const articles = await Article.find(queryString)
        .populate(
            'lessor',
            '_id fullname email phoneNumber avatar createdAt isAutoApproved'
        )
        .sort({ servicePackageId: 'asc', createdAt: 'desc' })
        .limit(limit)
        .skip(skip)
        .exec();
    const totalArticle = await Article.find(queryString).count();
    const servicePackageIds = map(articles, 'servicePackageId');
    const servicePackages = await ServicePackage.find({
        _id: { $in: servicePackageIds },
    }).exec();
    const city = await Location.findOne({ code: 79 });
    const objDistrict = keyBy(city.districts, 'code');
    const objServicePackage = keyBy(servicePackages, '_id');
    const article = articles.map((itm) => {
        const { servicePackageId, street } = itm;
        const district = objDistrict[itm.district] || {};
        const objWard = keyBy(district.wards, 'code');
        const ward = objWard[itm.ward] || {};
        const address =
            street + ', ' + ward.name + ', ' + district.name + ', ' + city.name;
        const servicePackage = objServicePackage[servicePackageId] || {};
        return {
            _id: itm._id,
            title: itm.title,
            address,
            location: itm.location,
            image: itm.image,
            area: itm.area,
            description: itm.description,
            lessor: itm.lessor,
            isApproved: itm.isApproved,
            isAvailable: itm.isAvailable,
            createdAt: itm.createdAt,
            startDate: itm.startDate,
            endDate: itm.endDate,
            servicePackageId: itm.servicePackageId,
            timeService: itm.timeService,
            price: itm.price,
            isDelete: itm.isDelete,
            aboutCreated: itm.aboutCreated,
            isExpired: itm.isExpired,
            startDateService: itm.startDateService,
            endDateService: itm.endDateService,
            servicePackageName: servicePackage.serviceName,
        };
    });
    let isOver = false;
    if (page * limit >= totalArticle || isEmpty(article)) {
        isOver = true;
    }
    const result = {
        data: article,
        total: totalArticle,
        isOver: isOver,
    };
    return result;
};
const getListTinTop = async (data) => {
    data.isDelete = false;
    data.isApproved = true;
    data.servicePackageId = '623d885d3d13700751208a7d';
    const page = data.page * 1 || 1;
    const limit = data.limit * 1 || 10;
    const skip = (page - 1) * limit;
    let searchField = data?.keyword || '';
    let keyword,
        articleIds = '';
    if (searchField) {
        searchField = removeVN(searchField);
        keyword = new RegExp(
            searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
            'i'
        );
        const listArticle = await Article.find();
        const articles = listArticle
            .map((article) => {
                if (removeVN(article.title).match(keyword)) {
                    return article;
                }
            })
            .filter((itm) => {
                return !isEmpty(itm);
            });
        articleIds = map(articles, 'id');
    }
    if (!isEmpty(articleIds)) {
        data._id = { in: articleIds };
    }
    const queryObj = data;
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
        /\b(gte|gt|lt|lte|in|regex|option)\b/g,
        (match) => `$${match}`
    );
    const queryString = JSON.parse(queryStr);
    const articles = await Article.find(queryString)
        .populate(
            'lessor',
            '_id fullname email phoneNumber avatar createdAt isAutoApproved'
        )
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .skip(skip)
        .exec();
    const totalArticle = await Article.find(queryString).count();
    const servicePackageIds = map(articles, 'servicePackageId');
    const servicePackages = await ServicePackage.find({
        _id: { $in: servicePackageIds },
    }).exec();
    const city = await Location.findOne({ code: 79 });
    const objDistrict = keyBy(city.districts, 'code');
    const objServicePackage = keyBy(servicePackages, '_id');
    const article = articles.map((itm) => {
        const { servicePackageId, street } = itm;
        const district = objDistrict[itm.district] || {};
        const objWard = keyBy(district.wards, 'code');
        const ward = objWard[itm.ward] || {};
        const address =
            street + ', ' + ward.name + ', ' + district.name + ', ' + city.name;
        const servicePackage = objServicePackage[servicePackageId] || {};
        return {
            _id: itm._id,
            title: itm.title,
            address,
            location: itm.location,
            image: itm.image,
            area: itm.area,
            description: itm.description,
            lessor: itm.lessor,
            isApproved: itm.isApproved,
            isAvailable: itm.isAvailable,
            createdAt: itm.createdAt,
            startDate: itm.startDate,
            endDate: itm.endDate,
            servicePackageId: itm.servicePackageId,
            timeService: itm.timeService,
            price: itm.price,
            isDelete: itm.isDelete,
            aboutCreated: itm.aboutCreated,
            isExpired: itm.isExpired,
            startDateService: itm.startDateService,
            endDateService: itm.endDateService,
            servicePackageName: servicePackage.serviceName,
        };
    });
    let isOver = false;
    if (page * limit >= totalArticle || isEmpty(article)) {
        isOver = true;
    }
    const result = {
        data: article,
        total: totalArticle,
        isOver: isOver,
    };
    return result;
};

const createService = async (accountId, data) => {
    const serivce = new Article({
        title: data.title,
        address: data.address,
        price: data.price,
        area: data.area,
        location: {
            latitude: data.location.latitude,
            longtitude: data.location.longtitude,
        },
        description: data.description,
        vendorId: accountId,
        isApprove: data.isApprove,
        isAvailable: data.isAvailable,
    });
    return Article.create(article);
};
const updateArticleById = async (articleId, data) => {
    const article = await Article.findById(articleId);
    if (!article)
        throw new AppError(httpStatus.NOT_FOUND, 'Bài viết không tồn tại');
    Object.assign(article, data);
    return await article.save();
};

const getArticleById = async (id) => {
    return await Article.findById(id);
};

const updateArticle = async (data) => {
    if (data?.imageURLs) {
        data.image = data.image.concat(data.imageURLs);
        console.log(data.image);
    }
    const updateArticle = await Article.updateOne(
        { _id: data.articleId },
        data
    );
    if (updateArticle.modifiedCount > 0) {
        const article = await Article.findById(data.articleId);
        return {
            article,
            status: 200,
            mesage: 'Cập nhật thành công',
        };
    }
    return {
        status: 400,
        message: 'Cập nhật không thành công',
    };
};
const deleteArticle = async (data) => {
    const deleteArticle = await Article.updateOne(
        { _id: data.articleId },
        { isDelete: true, deletedAt: new Date() }
    );
    return deleteArticle;
};
const getDetailArticle = async (data) => {
    const articleId = data.articleId;
    const article = await Article.findOne({ _id: articleId }).populate(
        'lessor',
        '_id fullname email phoneNumber avatar createdAt isAutoApproved'
    );
    if (!article) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bài viết không tồn tại');
    }
    const city = await Location.findOne({ code: 79 });
    const objDistrict = keyBy(city.districts, 'code');
    const district = objDistrict[article.district] || {};
    const objWard = keyBy(district.wards, 'code');
    const ward = objWard[article.ward] || {};
    const address =
        article.street +
        ', ' +
        ward.name +
        ', ' +
        district.name +
        ', ' +
        city.name;
    const result = { ...article._doc, address };
    return result;
};

const removeVN = (Text) => {
    return Text.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};
const searchArticle = async (data) => {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    //data.isDeleted = (data?.isDeleted === 'true') ? true : false;
    data.isApproved = data?.isApproved === 'true' ? true : false;
    const skip = (page - 1) * limit;
    let searchField = data?.keyword || '';
    let keyword = '';
    if (searchField) {
        searchField = removeVN(searchField);
        keyword = new RegExp(
            searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
            'i'
        );
    }
    const listArticle = await Article.find(data);
    const articles = listArticle.map((article) => {
        if (removeVN(article.title).match(keyword)) {
            return article;
        }
    });
    const articleIds = map(articles, 'id');
    const result = await Article.find({ _id: { $in: articleIds } })
        .populate(
            'lessor',
            '_id fullname email phoneNumber avatar createdAt isAutoApproved'
        )
        .sort({ servicePackageId: 'asc', createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .exec();
    const count = await Article.find({ _id: { $in: articleIds } }).count();
    let isOver = false;
    if (page * limit >= count || isEmpty(result)) {
        isOver = true;
    }
    return {
        listData: result,
        total: count,
        isOver,
    };
};

const updateServicePackage = async (data) => {
    const currentTime = new Date();
    const article = await Article.findById(data.articleId);
    const numOfDate = moment(article.endDate)
        .endOf('day')
        .diff(moment(currentTime).startOf('day'), 'day');
    if (data.numOfDate > numOfDate) {
        return {
            data: [],
            message:
                'Vui lòng chọn số ngày gói dịch vụ nhỏ hơn số ngày còn lại của bài đăng',
        };
    }
    const servicePackage = await ServicePackage.findOne({
        serviceName: data.servicePackageName,
    });
    const updateData = {
        startDateService: currentTime,
        endDateService: moment(currentTime).add(data.numOfDate, 'day').format(),
        servicePackageId: servicePackage._id,
        isPublished: true,
    };
    await Article.updateOne({ _id: data.articleId }, updateData);
    const updatedArticle = await Article.findById(data.articleId);
    return {
        data: updatedArticle,
        message: 'Cập nhật gói dịch vụ cho bài đăng thành công',
    };
};
const paymentServicePackage = async (req, lessorId, data) => {
    const saveData = {
        lessorId: lessorId,
        articleId: data.articleId,
        servicePackageName: data.servicePackageName,
        transactionAmount: data.prices,
        status: 'WAITFORPAYMENT',
    };
    const transaction = await ServicePackageTransaction.create(saveData);
    const orderDescription = `${data.servicePackageName}-${data.numOfDate}-${lessorId}-${transaction.transactionId}-${data.articleId}`;
    const transactionData = {
        typeOrders: 'payment',
        amount: `${~~data.prices}`,
        bankCode: 'NCB',
        orderDescription: orderDescription,
        language: 'vn',
        typeCart: 'CLIENT',
        //servicePackage: data.servicePackageId,
        lessor: lessorId,
    };
    const resultPayment = await VNPayService.payment(req, transactionData);
    if (resultPayment.success) {
        return {
            success: true,
            message: 'Thanh toán thành công',
            data: resultPayment.data.url,
            status: 200,
        };
    } else {
        return {
            success: false,
            message: 'Thanh toán thất bại',
            data: resultPayment.data.url,
            status: 200,
        };
    }
};
const savePaymentResult = async (data) => {
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
        const servicePackageName = vnp_Params.vnp_OrderInfo.split('-')[0];
        const numOfDate = vnp_Params.vnp_OrderInfo.split('-')[1];
        //const lessorId = vnp_Params.vnp_OrderInfo.split('-')[2];
        const transactionId = vnp_Params.vnp_OrderInfo.split('-')[3];
        const articleId = vnp_Params.vnp_OrderInfo.split('-')[4];
        const reqData = {
            numOfDate,
            servicePackageName,
            articleId,
        };
        if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
            const updateArticle = await updateServicePackage(reqData);
            const updateTransaction = await ServicePackageTransaction.updateOne(
                { transactionId: transactionId },
                { status: 'SUCCESS' }
            );
            return {
                success: true,
                data: updateArticle.data,
                message: 'Thanh toán thành công',
                status: 200,
            };
        }
        return {
            success: false,
            message: 'Thanh toán thất bại',
            status: 300,
        };
    } catch {
        return {
            success: false,
            message: 'Thanh toán thất bại',
            status: 500,
        };
    }
};
const getAllArticle = async (data) => {
    data.isDelete = data?.isDelete === 'true' ? true : false;
    data.isApproved = data?.isApproved === 'true' ? true : false;
    const page = data.page * 1 || 1;
    const limit = data.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const queryObj = data;
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
        /\b(gte|gt|lt|lte|in|regex|option)\b/g,
        (match) => `$${match}`
    );
    const queryString = JSON.parse(queryStr);
    const articles = await Article.find(queryString)
        .populate(
            'lessor',
            '_id fullname email phoneNumber avatar createdAt isAutoApproved'
        )
        .sort({ servicePackageId: 'asc', createdAt: 'desc' })
        .limit(limit)
        .skip(skip)
        .exec();
    const totalArticle = await Article.find(queryString).count();
    const servicePackageIds = map(articles, 'servicePackageId');
    const servicePackages = await ServicePackage.find({
        _id: { $in: servicePackageIds },
    }).exec();
    const city = await Location.findOne({ code: 79 });
    const objDistrict = keyBy(city.districts, 'code');
    const objServicePackage = keyBy(servicePackages, '_id');
    const article = articles.map((itm) => {
        const { servicePackageId, street } = itm;
        const district = objDistrict[itm.district] || {};
        const objWard = keyBy(district.wards, 'code');
        const ward = objWard[itm.ward] || {};
        const address =
            street + ', ' + ward.name + ', ' + district.name + ', ' + city.name;
        const servicePackage = objServicePackage[servicePackageId] || {};
        return {
            _id: itm._id,
            title: itm.title,
            address,
            location: itm.location,
            image: itm.image,
            area: itm.area,
            description: itm.description,
            vendorId: itm.vendorId,
            isApproved: itm.isApproved,
            isAvailable: itm.isAvailable,
            createdAt: itm.createdAt,
            startDate: itm.startDate,
            endDate: itm.endDate,
            servicePackageId: itm.servicePackageId,
            timeService: itm.timeService,
            price: itm.price,
            isDelete: itm.isDelete,
            aboutCreated: itm.aboutCreated,
            isExpired: itm.isExpired,
            startDateService: itm.startDateService,
            endDateService: itm.endDateService,
            servicePackageName: servicePackage.serviceName,
        };
    });
    let isOver = false;
    if (page * limit >= totalArticle || isEmpty(article)) {
        isOver = true;
    }
    const result = {
        status: 200,
        data: {
            article,
            total: totalArticle,
            isOver: isOver,
        },
    };
    return result;
};
const getSaveArticle = async (data, accountId) => {
    try {
        const account = await Account.findById(accountId);
        const articleIds = account.saveArticle;
        data._id = { in: articleIds };
        const page = data.page * 1 || 1;
        const limit = data.limit * 1 || 10;
        const skip = (page - 1) * limit;
        const queryObj = data;
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte|in|regex|option)\b/g,
            (match) => `$${match}`
        );
        const queryString = JSON.parse(queryStr);
        const articles = await Article.find(queryString)
            .populate(
                'lessor',
                '_id fullname email phoneNumber avatar createdAt isAutoApproved'
            )
            .sort({ servicePackageId: 'asc', createdAt: 'desc' })
            .limit(limit)
            .skip(skip)
            .exec();
        const totalArticle = await Article.find(queryString).count();
        const servicePackageIds = map(articles, 'servicePackageId');
        const servicePackages = await ServicePackage.find({
            _id: { $in: servicePackageIds },
        }).exec();
        const city = await Location.findOne({ code: 79 });
        const objDistrict = keyBy(city.districts, 'code');
        const objServicePackage = keyBy(servicePackages, '_id');
        const article = articles.map((itm) => {
            const { servicePackageId, street } = itm;
            const district = objDistrict[itm.district] || {};
            const objWard = keyBy(district.wards, 'code');
            const ward = objWard[itm.ward] || {};
            const address =
                street +
                ', ' +
                ward.name +
                ', ' +
                district.name +
                ', ' +
                city.name;
            const servicePackage = objServicePackage[servicePackageId] || {};
            return {
                _id: itm._id,
                title: itm.title,
                address,
                location: itm.location,
                image: itm.image,
                area: itm.area,
                description: itm.description,
                lessor: itm.lessor,
                isApproved: itm.isApproved,
                isAvailable: itm.isAvailable,
                createdAt: itm.createdAt,
                startDate: itm.startDate,
                endDate: itm.endDate,
                servicePackageId: itm.servicePackageId,
                timeService: itm.timeService,
                price: itm.price,
                isDelete: itm.isDelete,
                aboutCreated: itm.aboutCreated,
                isExpired: itm.isExpired,
                startDateService: itm.startDateService,
                endDateService: itm.endDateService,
                servicePackageName: servicePackage.serviceName,
            };
        });
        let isOver = false;
        if (page * limit >= totalArticle || isEmpty(article)) {
            isOver = true;
        }
        const result = {
            status: 200,
            data: {
                saveArticle: article,
                total: totalArticle,
                isOver: isOver,
            },
        };
        return result;
    } catch {
        return {
            status: 500,
            message: 'Lấy danh sách không thành công',
        };
    }
};
module.exports = {
    createArticle,
    getListArticle,
    createService,
    searchArticle,
    updateArticle,
    updateArticleById,
    deleteArticle,
    getDetailArticle,
    getListTinTop,
    paymentServicePackage,
    savePaymentResult,
    updateServicePackage,
    getAllArticle,
    getSaveArticle,
    getArticleById,
};
