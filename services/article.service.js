const httpStatus = require('http-status');
const dayjs = require('dayjs');
const { Article, ServicePackage, Lessor, Account } = require('../models');
const { map, keyBy, isEmpty } = require('lodash');
const moment = require('moment');

const createArticle = async (accountId, data, imageURLs) => {
    const lessor = await Lessor.findOne({ lessorId: accountId });
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
        address: data.address,
        price: data.price,
        area: data.area,
        location: {
            latitude: data?.latitude || 0,
            longitude: data?.longtitude || 0,
        },
        description: data.description,
        lessor: accountId,
        image: imageURLs,
    });
    const newArticle = await Article.create(dataArticle);
    if (account.isAutoApproved) {
        await Article.updateOne({ _id: newArticle._id }, { isApproved: true });
    }
    const articleUsed = lessor.articleUsed + 1;
    await Lessor.updateOne(
        { lessorId: accountId },
        { articleUsed: articleUsed }
    );
    const article = await Article.findOne({ _id: newArticle._id });
    return {
        data: article,
        message: 'Tạo bài đăng thành công',
    };
};
const getListArticle = async (data) => {
    data.isDelete = false;
    data.isApproved = true;
    data.servicePackageId = {
        in: ['623d88663d13700751208a7e', '623d886f3d13700751208a7f'],
    };
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
        .sort({ servicePackageId: 'asc', startDate: 'desc' })
        .limit(limit)
        .skip(skip);
    const totalArticle = await Article.find(queryString).count();
    const servicePackageIds = map(articles, 'servicePackageId');
    const servicePackage = await ServicePackage.find({
        _id: { $in: servicePackageIds },
    });
    const objServicePackage = keyBy(servicePackage, '_id');
    const article = articles.map((itm) => {
        const { servicePackageId } = itm;
        const servicePackage = objServicePackage[servicePackageId] || {};
        return {
            _id: itm._id,
            title: itm.title,
            address: itm.street + ', ' + itm.ward + ', ' + itm.district,
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
        .sort({ startDate: 'desc' })
        .limit(limit)
        .skip(skip);
    const totalArticle = await Article.find(queryString).count();
    const servicePackageIds = map(articles, 'servicePackageId');
    const servicePackage = await ServicePackage.find({
        _id: { $in: servicePackageIds },
    });
    const objServicePackage = keyBy(servicePackage, '_id');
    const article = articles.map((itm) => {
        const { servicePackageId } = itm;
        const servicePackage = objServicePackage[servicePackageId] || {};
        return {
            _id: itm._id,
            title: itm.title,
            district: itm.district,
            ward: itm.ward,
            street: itm.street,
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
const updateArticle = async (data) => {
    const updateArticle = await Article.updateOne(
        { _id: data.articleId },
        data
    );
    return updateArticle;
};
const deleteArticle = async (data) => {
    const deleteArticle = await Article.updateOne(
        { _id: data.articleId },
        { isDelete: true }
    );
    return deleteArticle;
};
const getDetailArticle = async (data) => {
    const articleId = data.articleId;
    const result = await Article.findOne({ _id: articleId }).populate(
        'lessor',
        '_id fullname email phoneNumber avatar createdAt isAutoApproved'
    );
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
    const skip = (page - 1) * limit;
    let searchField = data.keyword;
    searchField = removeVN(searchField);
    let keyword = new RegExp(
        searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'i'
    );
    const listArticle = await Article.find();
    const articles = listArticle.map((article) => {
        if (removeVN(article.title).match(keyword)) {
            return article;
        }
    });
    const articleIds = map(articles, 'id');
    const result = await Article.find({ _id: { $in: articleIds } })
        .skip(skip)
        .limit(limit)
        .exec();
    const count = await Article.find({ _id: { $in: articleIds } }).count();
    return {
        listData: result,
        total: count,
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
    const updateData = {
        startDateService: currentTime,
        endDateService: moment(currentTime).add(data.numOfDate, 'day').format(),
        servicePackageId: data.servicePackageId,
    };
    await Article.updateOne({ _id: data.articleId }, updateData);
    const updatedArticle = await Article.findById(data.articleId);
    return {
        data: updatedArticle,
        message: 'Cập nhật gói dịch vụ cho bài đăng thành công',
    };
};

module.exports = {
    createArticle,
    getListArticle,
    createService,
    searchArticle,
    updateArticle,
    deleteArticle,
    getDetailArticle,
    getListTinTop,
    updateServicePackage,
};
