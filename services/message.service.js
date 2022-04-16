const httpStatus = require('http-status');
const { Message } = require('../models/index');
const AppError = require('../utils/appError');

const createMessage = async (body) => {
  console.log("body", body)
  return await Message.create(body);
};

const getMessage = async (conversationId) => {
  console.log("conversationId", conversationId)
  const messages = await Message.find(conversationId);
  return messages;
}

module.exports = {
  createMessage,
  getMessage
}
