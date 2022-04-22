const httpStatus = require('http-status');
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
  if(conversation) {
    return conversation;
  }
  const data = {
    _id: converId,
    members : [body.senderId, body.receiverId] 
  }
  return await Conversation.create(data);
};

const getConversation = async (memberId) => {
  const conversation = await Conversation.find({
    members: {$in: memberId}
  })
  return conversation;
}
module.exports = {
  createConversation,
  getConversation
}
