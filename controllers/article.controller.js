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

const createdService = catchAsync(async (req, res) => {
  const service = await articleService.createdService(req.body);
  sendSuccess(res, { service }, httpStatus.CREATED, 'Service created');
});
const updateArticle = catchAsync(async (req, res) => {
  const articleId = req.params;
  const article = await articleService.updateArticle(req.body, articleId);
  sendSuccess(res, { article }, httpStatus.CREATED, 'Article updated successfully');
});
const deleteArticle = catchAsync(async (req, res) => {
  const articleId = req.params;
  const article = await articleService.updateArticle(req.body, articleId);
  sendSuccess(res, { article }, httpStatus.CREATED, 'Article deleted successfully');
});

const getListArticle = catchAsync(async (req, res) =>{
  const listArticle = await articleService.getListArticle(req.query);
  sendSuccess(res, {listArticle}, httpStatus.OK, 'get list article successfully');
})
const searchArticle = catchAsync(async (req, res) =>{
  const listArticle = await articleService.searchArticle(req.query);
  sendSuccess(res, {listArticle}, httpStatus.OK, 'get list article successfully');
})

module.exports = {
  createArticle,
  getListArticle,
  createdService,
  searchArticle,
  updateArticle,
  deleteArticle,
}