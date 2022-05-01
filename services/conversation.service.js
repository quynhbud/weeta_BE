const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const { Conversation } = require('../models/index');
const AppError = require('../utils/appError');

const createConversation = async (body) => {
  const senderId = body.senderId;
  const receiverId = body.receiverId;

  console.log(senderId.localeCompare(receiverId))
  const converId = (senderId.localeCompare(receiverId) === 1) ? (senderId + receiverId) : (receiverId + senderId);
  const conversation = await Conversation.findOne({
    _id: converId
  })
  console.log("conversationService", conversation)
  if (conversation) {
    return conversation;
  }
  const data = {
    _id: converId,
    members: [body.senderId, body.receiverId]
  }
  return await Conversation.create(data);
};

const getConversation = async (memberId) => {
  const conversation = await Conversation.find({
    members: { $in: memberId }
  })
  return conversation;
}

const getListConversations = async (data, accounId) => {
  const page = data.page || 1;
  const limit = data.limit || 10;
  const skip = (page - 1) * limit;
  const conversations = await Conversation.find({
    members: { $in: [accounId.toString()] }
  })
    .skip(skip)
    .limit(limit)
    .exec();
  const totalConvers = await Conversation.find({
    members: { $in: [accounId.toString()] }
  }).count();
  let isOver = false;
  if (page * limit >= totalConvers && !isEmpty(conversations)) {
    isOver = true;
  }
  const result = {
    data: conversations,
    total: totalConvers,
    isOver: isOver,
  };
  return result;
}
module.exports = {
  createConversation,
  getConversation,
  getListConversations,
}
