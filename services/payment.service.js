const { Article, ServicePackage, Lessor, Account, ServicePackageTransaction, MemberPackageTransaction, MemberPackage } = require('../models/index');
const VNPayService = require('./VNPay.service');
const moment = require('moment');

const paymentPackage = async (req, lessorId, data) => {
  let resultPayment = {};
  if (data.type === 'MEMBERPACKAGE') {
    const saveData = {
      lessorId: lessorId,
      memberPackageName: data.memberPackageName,
      transactionAmount: data.prices,
      status: 'WAITFORPAYMENT',
    }
    const transaction = await MemberPackageTransaction.create(saveData);
    const orderDescription = `${data.type}-${data.memberPackageName}-${transaction._id}-${lessorId}`
    const transactionData = {
      typeOrders: "payment",
      amount: `${~~data.prices}`,
      bankCode: "NCB",
      orderDescription: orderDescription,
      language: "vn",
      typeCart: 'CLIENT',
      //servicePackage: data.servicePackageId,
      lessor: lessorId,
    };
    resultPayment = await VNPayService.payment(
      req,
      transactionData,
    );
  }
  if (data.type === 'SERVICEPACKAGE') {
    const saveData = {
      lessorId: lessorId,
      articleId: data.articleId,
      servicePackageName: data.servicePackageName,
      transactionAmount: data.prices,
      status: 'WAITFORPAYMENT',
    }
    const transaction = await ServicePackageTransaction.create(saveData);
    const orderDescription = `${data.type}-${data.servicePackageName}-${data.numOfDate}-${lessorId}-${transaction.transactionId}-${data.articleId}`
    const transactionData = {
      typeOrders: "payment",
      amount: `${~~data.prices}`,
      bankCode: "NCB",
      orderDescription: orderDescription,
      language: "vn",
      typeCart: 'CLIENT',
      //servicePackage: data.servicePackageId,
      lessor: lessorId,
    };
    resultPayment = await VNPayService.payment(
      req,
      transactionData,
    );
  }

  if (resultPayment.success) {
    return {
      success: true,
      message: "Thanh toán thành công",
      data: resultPayment.data.url,
      status: 200,
    };
  } else {
    return {
      success: false,
      message: "Thanh toán thất bại",
      data: resultPayment.data.url,
      status: 200,
    };
  }
}

const savePaymentResult = async (data) => {
  try {
    let vnp_Params = {
      vnp_Amount: data.vnp_Amount,
      vnp_BankCode: data.vnp_BankCode,
      vnp_BankTranNo: data.vnp_BankTranNo,
      vnp_CardType: data.vnp_CardType,
      vnp_OrderInfo: data.vnp_OrderInfo,
      vnp_PayDate: data.vnp_PayDate,
      vnp_ResponseCode: data.vnp_ResponseCode,
      vnp_TmnCode: data.vnp_TmnCode,
      vnp_TransactionNo: data.vnp_TransactionNo,
      vnp_TransactionStatus: data.vnp_TransactionStatus,
      vnp_TxnRef: data.vnp_TxnRef,
      vnp_SecureHashType: data.vnp_SecureHashType,
      vnp_SecureHash: data.vnp_SecureHash,
    };
    const type = vnp_Params.vnp_OrderInfo.split('-')[0];
    if (type === 'MEMBERPACKAGE') {
      const memberPackageName = vnp_Params.vnp_OrderInfo.split('-')[1];
      const transactionId = vnp_Params.vnp_OrderInfo.split('-')[2];
      const accountId = vnp_Params.vnp_OrderInfo.split('-')[3];
      const memberPackage = await MemberPackage.findOne({ memberPackageName: memberPackageName })
      const reqData = {
        memberPackageId: memberPackage._id,
        transactionId,
        accountId,
      }
      if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
        const updateLessor = await updateMemberPackage(reqData);
        const updateTransaction = await MemberPackageTransaction.updateOne({ _id: transactionId }, { status: 'SUCCESS' })
        return {
          success: true,
          type: 'MEMBERPACKAGE',
          paymentId: transactionId,
          data: updateLessor.data,
          message: "Thanh toán thành công",
          status: 200,
        }
      }
      return {
        success: false,
        message: "Thanh toán thất bại",
        status: 300,
      }
    }
    if (type === 'SERVICEPACKAGE') {
      const servicePackageName = vnp_Params.vnp_OrderInfo.split('-')[1];
      const numOfDate = vnp_Params.vnp_OrderInfo.split('-')[2];
      //const lessorId = vnp_Params.vnp_OrderInfo.split('-')[2];
      const transactionId = vnp_Params.vnp_OrderInfo.split('-')[4];
      const articleId = vnp_Params.vnp_OrderInfo.split('-')[5];
      const reqData = {
        numOfDate,
        servicePackageName,
        articleId,
      }
      if (Number(vnp_Params.vnp_TransactionStatus) === 0) {
        console.log(1)
        const updateArticle = await updateServicePackage(reqData);
        const updateTransaction = await ServicePackageTransaction.updateOne({ transactionId: transactionId }, { status: 'SUCCESS' })
        const transaction = await ServicePackageTransaction.findOne({ transactionId: transactionId })
        return {
          success: true,
          type: 'MEMBERPACKAGE',
          paymentId: transaction._id,
          data: updateArticle.data,
          message: "Thanh toán thành công",
          status: 200,
        }
      }
      return {
        success: false,
        message: "Thanh toán thất bại",
        status: 300,
      }
    }

  } catch {
    return {
      success: false,
      message: "Thanh toán thất bại",
      status: 500,
    }
  }
}
const updateMemberPackage = async (data) => {
  const memberPackage = await MemberPackage.findById(data.memberPackageId);
  const updateData = {
    memberPackageId: data.memberPackageId,
    articleTotal: memberPackage.articlePerMonth,
    articleUsed: 0,
  };
  await Lessor.updateOne({ account: data.accountId }, updateData);
  const updateLessor = await Lessor.findOne({ account: data.accountId });
  return {
    data: updateLessor,
    message: 'Cập nhật gói thành viên người cho thuê thành công',
  };
}
const updateServicePackage = async (data) => {
  const currentTime = new Date();
  const article = await Article.findOne({ _id: data.articleId });
  const numOfDate = moment(article.endDate)
    .endOf('day')
    .diff(moment(currentTime).startOf('day'), 'day');
  if (data.numOfDate > numOfDate) {
    return {
      data: [],
      message:
        'Vui lòng chọn số ngày gói dịch vụ nhỏ hơn số ngày còn lại của bài đăng',
    };
  }
  const servicePackage = await ServicePackage.findOne({ serviceName: data.servicePackageName });
  const updateData = {
    startDateService: currentTime,
    endDateService: moment(currentTime).add(data.numOfDate, 'day').format(),
    servicePackageId: servicePackage._id,
    isPublished: true,
  };
  await Article.updateOne({ _id: data.articleId }, updateData);
  const updatedArticle = await Article.findById(data.articleId);
  return {
    data: updatedArticle,
    message: 'Cập nhật gói dịch vụ cho bài đăng thành công',
  };
};
module.exports = {
  paymentPackage,
  savePaymentResult,
  updateMemberPackage,
  updateServicePackage
}