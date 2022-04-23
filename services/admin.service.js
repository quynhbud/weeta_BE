const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const { Account, Article } = require('../models/index');
const AppError = require('../utils/appError');


const approvedArticle = async (articleId) => {
  const article = await Article.findById(articleId);
  if (isEmpty(article)) {
    return {
      msg: "không tìm thấy bài đăng",
      status: httpStatus.BAD_REQUEST,
    }
  }
  const update = await Article.updateOne({_id: articleId},{isApproved: true});
  return update;
};

const approvedIDCard = async (accountId) => {
  const update = await Account.updateOne({_id: accountId},{isAutoApproved: true});
  const account = await Account.findById(accountId);
  return account;
};


module.exports = {
  approvedArticle,
  approvedIDCard
};
