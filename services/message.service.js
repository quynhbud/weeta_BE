const httpStatus = require('http-status');
const { Message } = require('../models/index');
const AppError = require('../utils/appError');
const { isEmpty } = require('lodash');

const createMessage = async (body) => {
    return await Message.create(body);
};

const updateMessage = async (messageId, body) => {
    const message = await Message.findOne({
        _id: messageId,
    });
    if (!message) {
        return AppError(httpStatus.NOT_FOUND, 'Không tìm thấy tin nhắn');
    }
    Object.assign(message, body);
    return message.save();
};

const getMessage = async (data, conversationId) => {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversation: conversationId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' })
        .exec();
    const totalMessage = await Message.find({
        conversation: conversationId,
    }).count();
    let isOver = false;
    if (page * limit >= totalMessage || isEmpty(messages)) {
        isOver = true;
    }
    const result = {
        data: messages,
        total: totalMessage,
        isOver: isOver,
    };
    return result;
};

module.exports = {
    createMessage,
    getMessage,
    updateMessage,
};
