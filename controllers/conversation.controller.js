const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');
const { isEmpty } = require('lodash');

// create conversation
const createConversation = catchAsync(async (req, res) => {
    const conversation = await conversationService.createConversation(req.body);
    if (!conversation) {
        return sendError(
            res,
            httpStatus.BAD_REQUEST,
            'Create conversation fail'
        );
    }
    sendSuccess(res, conversation, httpStatus.CREATED, 'conversation created');
});

// get conver of user
const getConversation = catchAsync(async (req, res) => {
    const memberId = [req.params.memberId];
    const conversation = await conversationService.getConversation(memberId);
    if (!conversation) {
        return sendError(res, httpStatus.NOT_FOUND, 'get conversation faild');
    }
    sendSuccess(
        res,
        conversation,
        httpStatus.CREATED,
        'get conversation successfully'
    );
});

const getListConversations = catchAsync(async (req, res) => {
    const accountId = [req.user._id];
    const query = req.query;
    const result = await conversationService.getListConversations(
        query,
        accountId
    );
    //   if(isEmpty(result.data)) {
    //     return sendError(res, httpStatus.BAD_REQUEST, 'Không có cuộc hội thoại nào');
    //   }
    return sendSuccess(
        res,
        result,
        httpStatus.OK,
        isEmpty(result.data)
            ? 'Không có cuộc hội thoại nào'
            : 'Lấy danh sách cuộc hội thoại thành công'
    );
});
module.exports = {
    createConversation,
    getConversation,
    getListConversations,
};
