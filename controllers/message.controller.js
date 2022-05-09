const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { messageService, conversationService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

// create message
const createMessage = catchAsync(async (req, res) => {
    const body = req.body;
    const message = await messageService.createMessage(body);
    await conversationService.updateConversation(body.conversation, {
        latestMessage: message,
    });
    if (!message) {
        return sendError(res, httpStatus.BAD_REQUEST, 'Create message fail');
    }
    sendSuccess(res, message, httpStatus.CREATED, 'create message created');
});
//get message in conversation
const getMessage = catchAsync(async (req, res) => {
    const conversationId = req.params.conversationId;
    //   console.log("conversationId", conversationId)
    const message = await messageService.getMessage(req.query, conversationId);
    if (!message) {
        return sendError(res, httpStatus.BAD_REQUEST, 'Không có tin nhắn nào');
    }
    sendSuccess(
        res,
        message,
        httpStatus.OK,
        'Lấy danh sách tin nhắn thành công'
    );
});

module.exports = {
    createMessage,
    getMessage,
};
