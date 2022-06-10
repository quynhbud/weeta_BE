const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportReasonService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

const createReason = catchAsync(async (req, res) => {
    const result = await reportReasonService.createReason({ ...req.body });
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const updateReason = catchAsync(async (req, res) => {
    const result = await reportReasonService.updateReason({
        reasonId: req.params.reasonId,
        ...req.body,
    });
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const deleteReason = catchAsync(async (req, res) => {
    const result = await reportReasonService.deleteReason(req.params.reasonId);
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

const getListReason = catchAsync(async (req, res) => {
    const result = await reportReasonService.getListReason();
    if (result.status !== 200) {
        sendError(res, result.status, result.message);
    }
    sendSuccess(res, result.data, result.status, result.message);
});

module.exports = {
    createReason,
    updateReason,
    deleteReason,
    getListReason,
};
