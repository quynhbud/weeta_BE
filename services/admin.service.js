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
const getListUser = async(data) => {
  try {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const users = await Account.find({role: 'user', isDelete: false})
    .skip(skip)
    .limit(limit);
    const total = await Account.find({role: 'user', isDelete: false}).count();
    const result = {
      users: users,
      total: total,
    }
    return {
      data: result,
      status: 200,
      message: 'Lấy danh sách user thành công'
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Lấy danh sách user không thành công'
    }
  }
}
const getListLessor = async(data) => {
  try {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const lessor = await Account.find({role: 'lessor', isDelete: false})
    .skip(skip)
    .limit(limit);
    const total = await Account.find({role: 'lessor', isDelete: false}).count();
    const result = {
      users: lessor,
      total: total,
    }
    return {
      data: result,
      status: 200,
      message: 'Lấy danh sách lessor thành công'
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Lấy danh sách lessor không thành công'
    }
  }
}
const deleteAccount = async(data) => {
  try {
    const account = await Account.findOneAndUpdate({_id: data},{isDelete: true})
    return {
      data: account,
      status: 200,
      message: 'Xóa tài khoản thành công'
    }
  } catch (error) {
    return {
      status: 500,
      message: 'Xóa tài khoản không thành công'
    }
  }
}


module.exports = {
  approvedArticle,
  approvedIDCard,
  getListUser,
  getListLessor,
  deleteAccount,
};
