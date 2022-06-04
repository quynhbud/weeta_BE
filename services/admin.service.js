const httpStatus = require('http-status');
const { isEmpty, groupBy, sum, map } = require('lodash');
const { Account, Article, MemberPackageTransaction, ServicePackageTransaction } = require('../models/index');
const AppError = require('../utils/appError');
const moment = require('moment');

const approvedArticle = async (articleId) => {
  const article = await Article.findById(articleId);
  if (isEmpty(article)) {
    return {
      msg: "không tìm thấy bài đăng",
      status: httpStatus.BAD_REQUEST,
    }
  }
  const update = await Article.updateOne({ _id: articleId }, { isApproved: true });
  return update;
};

const approvedIDCard = async (accountId) => {
  const update = await Account.updateOne({ _id: accountId }, { isAutoApproved: true });
  const account = await Account.findById(accountId);
  return account;
};
const getListUser = async (data) => {
  try {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const users = await Account.find({ role: 'user', isDelete: false })
      .skip(skip)
      .limit(limit);
    const total = await Account.find({ role: 'user', isDelete: false }).count();
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
const getListLessor = async (data) => {
  try {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const lessor = await Account.find({ role: 'lessor', isDelete: false })
      .skip(skip)
      .limit(limit);
    const total = await Account.find({ role: 'lessor', isDelete: false }).count();
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
const deleteAccount = async (data) => {
  try {
    const account = await Account.findOneAndUpdate({ _id: data }, { isDelete: true })
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
const articleOfWeek = async () => {
  const startDate = moment()
    .subtract(7, 'day')
    .startOf('day')
    .format('YYYY-MM-DD HH:00:00');
  const endDate = moment().endOf('day').format('YYYY-MM-DD HH:59:59');
  const arrKey = Array.from({ length: 7 }, (_, i) =>
    moment()
      .subtract(6 - i, 'day')
      .date(),
  );
  const articles =  await Article.find({ createdAt: { $gte: startDate , $lte: endDate }});
  const objArticle = groupBy(articles, (itm) => {
    const { createdAt } = itm;
    return numOfType = moment(createdAt).get('date');
  });
  const result = arrKey.map((num) => {
    const articles = objArticle[num] || [];
    return {
      time: num,
      value: articles.length,
    };
  });
  return  {
    status: 200,
    data: result,
    message: 'Lấy số bài đăng trong 1 ngày thành công'
  }
}
const statisticalTransaction = async (data) => {
  const startDate = moment()
    .subtract(12, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
  const endDate = moment().endOf('month').format('YYYY-MM-DD HH:59:59');
  const arrKey = Array.from(
    { length: 12 },
    (_, i) =>
      moment()
        .subtract(11 - i, 'month')
        .month() + 1,
  );
  let transactions = [];
  if(data.type === 'MEMBERPACKAGE'){
     transactions = await MemberPackageTransaction
    .find({createdAt:{ $gte: startDate , $lte: endDate }, status: 'SUCCESS'});
  }
  if(data.type === 'SERVICEPACKAGE'){
    transactions = await ServicePackageTransaction
    .find({createdAt:{ $gte: startDate , $lte: endDate }, status: 'SUCCESS'});
  }
  const objTransaction = groupBy(transactions, (itm) => {
    const { createdAt } = itm;
    return numOfType = moment(createdAt).get('month') + 1;
  });
  const result = arrKey.map((num) => {
    const transactions = objTransaction[num] || [];
    return {
      time: num,
      value: sum(map(transactions, 'transactionAmount')) || 0,
    };
  });
  return  {
    status: 200,
    data: result,
    message: 'Lấy doanh thu trong 1 thang thành công'
  }
}
module.exports = {
  approvedArticle,
  approvedIDCard,
  getListUser,
  getListLessor,
  deleteAccount,
  articleOfWeek,
  statisticalTransaction,
};
