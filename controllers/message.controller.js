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
    sendSuccess(res, message, httpStatus.CREATED, 'created message');
});

// update message
const updateMessage = catchAsync(async (req, res) => {
    console.log('int eeee');
    const body = req.body;
    const message = await messageService.updateMessage(
        req.params.messageId,
        body
    );
    if (!message) {
        return sendError(res, httpStatus.BAD_REQUEST, 'update message fail');
    }
    sendSuccess(res, message, httpStatus.CREATED, 'updated message');
});

// remove message
const removeMessage = catchAsync(async (req, res) => {
    const message = await messageService.updateMessage(req.params.messageId, {
        isDelete: true,
    });
    if (!message) {
        return sendError(res, httpStatus.BAD_REQUEST, 'remove message fail');
    }
    sendSuccess(res, message, httpStatus.CREATED, 'removed message');
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
    updateMessage,
    removeMessage,
};
