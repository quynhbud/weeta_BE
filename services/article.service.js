const httpStatus = require('http-status');
const dayjs = require('dayjs');
const tokenService = require('./token.service');
const accountService = require('./account.service');
const servicePackage = require('./servicePackage.service');
const emailService = require('./email.service');
const { Token, Article, ServicePackage } = require('../models');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeature');
const { tokenTypes } = require('../config/tokens');
const { query } = require('../config/logger');
const { map, keyBy } = require('lodash');

const createArticle = async (accountId, data) => {
  console.log(data);
  const article = new Article({
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
  })
  return Article.create(article);
}
const getListArticle = async (data) => {
  console.log("data", data)
  data.isDelete = false;
  data.isApproved = true;
  const page = data.page * 1 || 1;
  const limit = data.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const queryObj = data;
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in|regex|option)\b/g, (match) => `$${match}`);
  const articles = await Article.find(JSON.parse(queryStr))
  .sort({createdAt: "desc"})
  .limit(limit)
  .skip(skip);
  const totalArticle = await Article.find(JSON.parse(queryStr)).count();
  const servicePackageIds = map(articles, 'servicePackageId');
  const servicePackage = await ServicePackage.find({ _id: { $in: servicePackageIds } });
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
    }
  })
  const result = {
    data: article,
    total: totalArticle,
  }
  return result;
}

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
  })
  return Article.create(article);
}
const updateArticle = async (data) => {
  const article = await Article.findById(data.articleId);
  const updateArticle = await Article.updateOne({ _id: accountId }, data);
  return updateArticle;
}
const deleteArticle = async (data) => {
  const article = await Article.findById(data.articleId);
  const deleteArticle = await Article.updateOne({ _id: accountId }, { isDelete: true });
  return deleteArticle;
}
const removeVN = (Text) => {
  return Text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};
const searchArticle = async (data) => {
  let searchField = data.keyword;
  searchField = removeVN(searchField);
  let keyword = new RegExp(
    searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
    'i',
  );
  const listArticle = await Article.find();
  const result = listArticle.map((article) => {
    if (removeVN(article.title).match(keyword)) {
      return article;
    };
  })
  return result;
}
module.exports = {
  createArticle,
  getListArticle,
  createService,
  searchArticle,
  updateArticle,
  deleteArticle,
};