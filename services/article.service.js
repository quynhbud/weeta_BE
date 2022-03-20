const httpStatus = require('http-status');
const tokenService = require('./token.service');
const accountService = require('./account.service');
const emailService = require('./email.service');
const { Token, Article } = require('../models');
const AppError = require('../utils/appError');
const { tokenTypes } = require('../config/tokens');

const createArticle = async(accountId, data) => {
  console.log(data);
  const article = new Article ({
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
  createArticle
};