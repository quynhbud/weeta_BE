const httpStatus = require('http-status');
const { isEmpty, groupBy, sum, map, reverse } = require('lodash');
const { Account, Article, MemberPackageTransaction, ServicePackageTransaction, Lessor } = require('../models/index');
const AppError = require('../utils/appError');
const moment = require('moment');
const { start } = require('pm2');

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
  await Lessor.updateOne({account: accountId}, {isNeedAutoApproved: false});
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
  const month = moment().get('month') + 1;
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
  let newArr = [];
  for(let i = arrKey.length-1 ;i>=0;i--){
    if(arrKey[i-1] > arrKey[i]){
      newArr.push(arrKey[i]+'/'+(month))
      for(let k = i-1 ;k>=0;k--){
        newArr.push(arrKey[k]+'/'+(month-1))
      }
      i = 0;
    }
    else{
      newArr.push(arrKey[i]+'/'+(month))
    }
  }
  reverse(newArr);
  const articles = await Article.find({ createdAt: { $gte: startDate, $lte: endDate }, isApproved: true });
  const objArticle = groupBy(articles, (itm) => {
    const { createdAt } = itm;
    const numOfType = moment(createdAt).get('date');
    const month = moment(createdAt).get('month');
    return numOfType+'/'+(month+1);
  });
  const result = newArr.map((num) => {
    const articles = objArticle[num] || [];
    return {
      time: num,
      value: articles.length,
    };
  });
  return {
    status: 200,
    data: result,
    message: 'Lấy số bài đăng trong 1 ngày thành công'
  }
}
const statisticalTransaction = async (data) => {
  const year = moment().get('year');
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
  let newArr = [];
  for(let i = arrKey.length-1 ;i>=0;i--){
    if(arrKey[i-1] > arrKey[i]){
      newArr.push(arrKey[i]+'/'+(year))
      for(let k = i-1 ;k>=0;k--){
        newArr.push(arrKey[k]+'/'+(year-1))
      }
      i = 0;
    }
    else{
      newArr.push(arrKey[i]+'/'+(year))
    }
  }
  reverse(newArr)
  let transactions = [];
  if (data.type === 'MEMBERPACKAGE') {
    transactions = await MemberPackageTransaction
    .find({ createdAt: { $gte: startDate, $lte: endDate }, status: 'SUCCESS' });
  }
  if (data.type === 'SERVICEPACKAGE') {
    transactions = await ServicePackageTransaction
    .find({ createdAt: { $gte: startDate, $lte: endDate }, status: 'SUCCESS' });
  }
  const objTransaction = groupBy(transactions, (itm) => {
    const { createdAt } = itm;
    const numOfType = moment(createdAt).get('month') + 1;
    const year = moment(createdAt).get('year');
    return numOfType+'/'+year
  });
  const result = newArr.map((num) => {
    const transactions = objTransaction[num] || [];
    return {
      time: num,
      value: sum(map(transactions, 'transactionAmount')) || 0,
    };
  });
  return {
    status: 200,
    data: result,
    message: 'Lấy doanh thu trong 1 thang thành công'
  }
}
const listLessorNeedAutoApproved = async (data) => {
  try {
    const page = data?.page * 1 || 1;
    const limit = data?.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const listLessor = await Lessor.find({ isNeedAutoApproved: true })
    const accountIds = map(listLessor, 'account');
    const accounts = await Account.find({ _id: { $in: accountIds } })
      .skip(skip)
      .limit(limit);
    const total = await Account.find({ _id: { $in: accountIds } }).count();
    const result = {
      users: accounts,
      total: total,
    }
    return {
      data: result,
      status: 200,
      message: 'Lấy danh sách lessor cần duyệt id card thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Lấy danh sách lessor cần duyệt id card thất bại'
    }
  }
}
const rejectIDCard = async (accountId) => {
  await Lessor.updateOne({account: accountId}, {isNeedAutoApproved: false});
  await Account.updateOne({_id: accountId}, {IDCard: []})
  const account = await Account.findById(accountId);
  return account;
}
const totalRevenue = async() => {
  try {
    const startDate = moment().startOf('month').format('YYYY-MM-DD HH:00:00');
    const endDate = moment().endOf('month').format('YYYY-MM-DD HH:00:00');
    const prevStartDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const prevEndDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const [memberTrans, serviceTrans, memberTransPrevMonth, serviceTransPrevMonth, memberTransInMonth, serviceTransInMonth] = 
      await Promise.all([
        MemberPackageTransaction.find({status: 'SUCCESS'}),
        ServicePackageTransaction.find({status: 'SUCCESS'}),
        MemberPackageTransaction.find({status: 'SUCCESS', createdAt : { $gte: prevStartDate, $lte: prevEndDate }}),
        ServicePackageTransaction.find({status: 'SUCCESS', createdAt : { $gte: prevStartDate, $lte: prevEndDate }}),
        MemberPackageTransaction.find({status: 'SUCCESS', createdAt : { $gte: startDate, $lte: endDate }}),
        ServicePackageTransaction.find({status: 'SUCCESS', createdAt : { $gte: startDate, $lte: endDate }}),
      ])
    const totalTransactions = sum(map(memberTrans.concat(serviceTrans), 'transactionAmount')) || 0
    const totalTransactionPrevMonth = sum(map(memberTransPrevMonth.concat(serviceTransPrevMonth), 'transactionAmount')) || 0
    const totalTransactionInMonth = sum(map(memberTransInMonth.concat(serviceTransInMonth), 'transactionAmount')) || 0 ;
    return {
      status: 200,
      data: {
        totalTransactions,
        totalTransactionPrevMonth,
        totalTransactionInMonth
      },
      message: "Lấy tổng doanh thu thành công"
    }
  } catch {
    return {
      status: 500
    }
  }
}
const totalArticle = async() => {
  try {
    const startDate = moment().startOf('month').format('YYYY-MM-DD HH:00:00');
    const endDate = moment().endOf('month').format('YYYY-MM-DD HH:00:00');
    const prevStartDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const prevEndDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const [totalArticle,  totalArticlePrevMonth, totalArticleInMonth] = 
    await Promise.all([
      Article.find({isApproved: true}).count(),
      Article.find({isApproved: true, createdAt : { $gte: prevStartDate, $lte: prevEndDate }}).count(),
      Article.find({isApproved: true, createdAt : { $gte: startDate, $lte: endDate }}).count(),
    ])
    return {
      status: 200,
      data: {
        totalArticle,
        totalArticlePrevMonth,
        totalArticleInMonth
      },
      message: 'Lấy tổng tin đăng thành công'
    }
  } catch  {
    return {
      status: 500
    }
  }
}
const totalUser = async(data) => {
  try {
    const role = data.role;
    const startDate = moment().startOf('month').format('YYYY-MM-DD HH:00:00');
    const endDate = moment().endOf('month').format('YYYY-MM-DD HH:00:00');
    const prevStartDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const prevEndDate = moment()
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD HH:00:00');
    const [totalUser,  totalUserPrevMonth, totalUserInMonth] = 
    await Promise.all([
      Account.find({role: role, isEmailVerified: true}).count(),
      Account.find({role: role, isEmailVerified: true, createdAt : { $gte: prevStartDate, $lte: prevEndDate }}).count(),
      Account.find({role: role, isEmailVerified: true, createdAt : { $gte: startDate, $lte: endDate }}).count(),
    ])
    return {
      status: 200,
      data: {
        totalUser,
        totalUserPrevMonth,
        totalUserInMonth
      },
      message: 'Lấy tổng người dùng thành công'
    }
  } catch  {
    return {
      status: 500
    }
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
  listLessorNeedAutoApproved,
  rejectIDCard,
  totalRevenue,
  totalArticle,
  totalUser,
};
