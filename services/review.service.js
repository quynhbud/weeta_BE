const httpStatus = require('http-status');
const dayjs = require('dayjs');
const {
  Review
} = require('../models');
const { map, keyBy, isEmpty } = require('lodash');
const VNPayService = require('../services/VNPay.service');
const moment = require('moment');

const createReview = async (data) => {
  try {
    const review = await Review.create(data)
    return {
      status: 200,
      data: review,
      message: 'Tạo đánh giá thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Tạo đánh giá thất bại'
    }
  }
};

const updateReview = async (data) => {
  try {
    const {id, ...rest} = data;
    await Review.updateOne({_id: id}, rest);
    const review = await Review.findById(id);
    return {
      status: 200,
      data: review,
      message: 'Cập nhật đánh giá thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Cập nhật đánh giá thất bại'
    }
  }
};

const deleteReview = async (data) => {
  try {
    const {id} = data;
    await Review.updateOne({_id: id}, {isDeleted: true});
    const review = await Review.findById(id);
    return {
      status: 200,
      data: review,
      message: 'Xóa đánh giá thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Xóa đánh giá thất bại'
    }
  }
};

const getListReview = async (data) => {
  try {
    const {articleId} = data;
    const reviews = await Review.find({articleId: articleId, isDeleted: false})
    .populate(
      'accountId',
      '_id fullname avatar'
    );
    return {
      status: 200,
      data: reviews,
      message: 'Lấy danh sách đánh giá thành công'
    }
  } catch {
    return {
      status: 500,
      message: 'Lấy danh sách đánh giá thất bại'
    }
  }
};
module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getListReview
}