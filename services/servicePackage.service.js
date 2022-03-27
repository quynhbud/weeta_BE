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
const  {map}  = require('lodash');

const createServicePackage = async(data) => {
  const servicePackage = new ServicePackage ({
    name: data.name,
    price: data.price,
  })
  return ServicePackage.create(servicePackage);
}
const getListServicePackage = async (data) => {
  const features =  new APIFeatures(ServicePackage.find(), data)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  const servicePackage = await features.query;
  return servicePackage;
}
const getServicePackageById = async(data) => {
  return ServicePackage.findById(data);
}
module.exports = {
  createServicePackage,
  getListServicePackage,
  getServicePackageById,
};