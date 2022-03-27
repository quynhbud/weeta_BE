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
  data.deletedAt = null;
  data.isApproved = true;
  const features = new APIFeatures(Article.find(), data)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const articles = await features.query;
  const servicePackageIds = map(articles, 'servicePackageId');
  const servicePackage = await ServicePackage.find({ _id: { $in: servicePackageIds } });
  const objServicePackage = keyBy(servicePackage, '_id');
  const result = articles.map((itm) => {
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
module.exports = {
  createArticle,
  getListArticle,
  createService,
};