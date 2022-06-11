const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

const createReview = catchAsync(async (req, res) => {
    const accountId = req.user._id;
    const result = await reviewService.createReview({ ...req.body, accountId });
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const updateReview = catchAsync(async (req, res) => {
    const accountId = req.user._id;
    const result = await reviewService.updateReview({
        ...req.body,
        ...req.params,
        accountId,
    });
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const deleteReview = catchAsync(async (req, res) => {
    const result = await reviewService.deleteReview(req.params);
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const getListReview = catchAsync(async (req, res) => {
    const result = await reviewService.getListReview(req.params);
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});
module.exports = {
    createReview,
    updateReview,
    getListReview,
    deleteReview,
};
