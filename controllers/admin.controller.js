const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { AdminService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');



// get conver of user
const approvedArticle = catchAsync(async (req, res) => {
  const articleId = req.params.id; //id: articleId
  const article = await AdminService.approvedArticle(articleId);
  if (!article) {
    return sendError(res, httpStatus.NOT_FOUND, 'approved faild');
  }
  sendSuccess(res, article, httpStatus.CREATED, 'approved successfully');
});
module.exports = {
  approvedArticle,
}