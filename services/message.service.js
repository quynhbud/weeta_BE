const httpStatus = require('http-status');
const { Message } = require('../models/index');
const AppError = require('../utils/appError');
const { isEmpty } = require('lodash');

const createMessage = async (body) => {
    return await Message.create(body);
};

const getMessage = async (data, conversationId) => {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversation: conversationId })
        .skip(skip)
        .limit(limit)
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
};
