const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { AdminService, emailService} = require('../services');
const { sendSuccess, sendError } = require('./return.controller');
const { isEmpty } = require('lodash');

const approvedArticle = catchAsync(async (req, res) => {
  const articleId = req.params.id; //id: articleId
  const email = req.body.email;
  const article = await AdminService.approvedArticle(articleId);
  if (!article) {
    return sendError(res, httpStatus.NOT_FOUND, 'Chấp nhận tin đăng thất bại');
  }
  await emailService.sendAcceptArticleEmail(email, articleId);
  sendSuccess(res, article, httpStatus.CREATED, 'Chấp nhận tin đăng thành công');
});
const rejectArticle = catchAsync(async (req, res) => {
  const articleId = req.params.id; //id: articleId
  const reasonReject = req.body.reasonReject;
  const email = req.body.email;
  await emailService.sendRejectArticleEmail(email, articleId, reasonReject);
  sendSuccess(res, articleId, httpStatus.OK, 'Từ chối tin đăng thành công');
});
const approvedIDCard = catchAsync(async(req, res) => {
  const accountID = req.params.id;
  const account = await AdminService.approvedIDCard(accountID);
  if (isEmpty(account)) {
    return sendError(res, httpStatus.NOT_FOUND, 'approved faild');
  }
  sendSuccess(res, account, httpStatus.OK, 'approved successfully');
})
const getListUser = catchAsync(async(req, res) => {
  const result = await AdminService.getListUser(req.query);
  if (result.status !== 200) {
    return sendError(res, result.status, result.message);
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const getListLessor = catchAsync(async(req, res) => {
  const result = await AdminService.getListLessor(req.query);
  if (result.status !== 200) {
    return sendError(res, result.status, result.message);
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const deleteAccount = catchAsync(async(req, res) => {
  const result = await AdminService.deleteAccount(req.params.accountId);
  if (result.status !== 200) {
    return sendError(res, result.status, result.message);
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const articleOfWeek  = catchAsync(async(req, res) => {
  const result = await AdminService.articleOfWeek();
  if(result.status !== 200) {
    return sendError(res, result.status, 'Lỗi');
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const statisticalTransaction  = catchAsync(async(req, res) => {
  const result = await AdminService.statisticalTransaction(req.query);
  if(result.status !== 200) {
    return sendError(res, result.status, 'Lỗi');
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const listLessorNeedAutoApproved = catchAsync(async(req, res) => {
  const result = await AdminService.listLessorNeedAutoApproved(req.query);
  if(result.status !== 200) {
    return sendError(res, result.status, 'Lỗi');
  }
  sendSuccess(res, result.data, result.status, result.message);
})
const rejectIDCard = catchAsync(async(req,res) =>{
  const accountID = req.params.id;
  const account = await AdminService.rejectIDCard(accountID);
  if (isEmpty(account)) {
    return sendError(res, httpStatus.NOT_FOUND, 'reject fail');
  }
  sendSuccess(res, account, httpStatus.OK, 'reject successfully');
})
module.exports = {
  approvedArticle,
  approvedIDCard,
  getListUser,
  getListLessor,
  deleteAccount,
  rejectArticle,
  articleOfWeek,
  statisticalTransaction,
  listLessorNeedAutoApproved,
  rejectIDCard,
}