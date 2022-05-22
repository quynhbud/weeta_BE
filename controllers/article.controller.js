const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { articleService, imageService, VNPayService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');
const { isEmpty } = require('lodash');
const config = require("../config/config");

const createArticle = catchAsync(async (req, res) => {
  const imageURLs = await imageService.addMultiImage(req.files)
  const article = await articleService.createArticle(req.user._id, req.body, imageURLs);
  if (isEmpty(article.data)) {
    return sendError(res, httpStatus.BAD_REQUEST, article.message)
  }
  return sendSuccess(res, article.data, httpStatus.CREATED, article.message);
});

const createdService = catchAsync(async (req, res) => {
  const service = await articleService.createdService(req.body);
  sendSuccess(res, { service }, httpStatus.CREATED, 'Service created');
});
const updateArticle = catchAsync(async (req, res) => {
  const articleId = req.params;
  const article = await articleService.updateArticle(req.body, articleId);
  sendSuccess(res, article, httpStatus.CREATED, 'Article updated successfully');
});
const deleteArticle = catchAsync(async (req, res) => {
  const articleId = req.params;
  const article = await articleService.updateArticle(req.body, articleId);
  sendSuccess(res, { article }, httpStatus.CREATED, 'Article deleted successfully');
});

const getListArticle = catchAsync(async (req, res) => {
  const listArticle = await articleService.getListArticle(req.query);
  sendSuccess(res, listArticle, httpStatus.OK, 'get list article successfully');
})
const searchArticle = catchAsync(async (req, res) => {
  const listArticle = await articleService.searchArticle(req.query);
  sendSuccess(res, listArticle, httpStatus.OK, 'get list article successfully');
})

const getDetailArticle = catchAsync(async (req, res) => {
  const article = await articleService.getDetailArticle(req.params);
  if (isEmpty(article)) {
    return sendError(res, httpStatus.BAD_REQUEST, 'get detail article failed')
  }
  return sendSuccess(res, article, httpStatus.OK, 'get detail article successfully');
})

const getListTinTop = catchAsync(async (req, res) => {
  const listArticle = await articleService.getListTinTop(req.query);
  if (isEmpty(listArticle)) {
    return sendError(res, httpStatus.BAD_REQUEST, 'get detail article failed')
  }
  return sendSuccess(res, listArticle, httpStatus.OK, ' successfully');
})

const paymentServicePackage = catchAsync(async (req, res) => {
  const lessorId = req.user._id;
  const result = await articleService.paymentServicePackage(req,lessorId,req.body);
  if(result.status != 200) {
    return sendError (res, result.status, result.message);
  }
  return sendSuccess(res, result.data, result.status, result.message);
})

const savePaymentResult = catchAsync(async (req, res) => {
  const result = await articleService.savePaymentResult(req.query);
  if(result.status != 200) {
    return sendError (res, result.status, result.message);
  }
  return sendSuccess(res, result.data, result.status, result.message);
})

const updateServicePackage = catchAsync(async (req, res) => {
  const article = await articleService.updateServicePackage(req.body);
  if(isEmpty(article.data)) {
    return sendError(res, httpStatus.BAD_REQUEST, article.message)
  }
  return sendSuccess(res, article.data, httpStatus.OK, article.message);
})
const getIPN = catchAsync(async(req, res) => {
  var vnp_Params = req.query;
  console.log("vnp_Params", vnp_Params)
    var secureHash = vnp_Params['vnp_SecureHash'];
    console.log("secureHash", secureHash)

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = VNPayService.sortObject(vnp_Params);
    
    var secretKey = config.vnpay.vnp_HashSecret;
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    console.log("signed", signed)
     

    if(vnp_Params['vnp_ResponseCode']=== '00'){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
  })
const getAllArticle = catchAsync(async(req,res) => {
  const listArticle = await articleService.getAllArticle(req.query);
  if (isEmpty(listArticle)) {
    return sendError(res, httpStatus.BAD_REQUEST, 'Lấy toàn bộ danh sách thất bại')
  }
  return sendSuccess(res, listArticle, httpStatus.OK, 'Lấy toàn bộ danh sách thành công');
})

module.exports = {
  createArticle,
  getListArticle,
  createdService,
  searchArticle,
  updateArticle,
  deleteArticle,
  getDetailArticle,
  getListTinTop,
  paymentServicePackage,
  updateServicePackage,
  savePaymentResult,
  getIPN,
  getAllArticle,
}