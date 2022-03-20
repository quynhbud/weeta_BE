const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { articleService } = require('../services');
const { sendSuccess } = require('./return.controller');

const createArticle = catchAsync(async (req, res) => {
  const article = await articleService.createArticle(req.user._id,req.body);
  sendSuccess(res, { article }, httpStatus.CREATED, 'Article created');
});

module.exports = {
  createArticle,
}