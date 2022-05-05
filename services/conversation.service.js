const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const Account = require('../models/account.model');
const { Conversation } = require('../models/index');
const AppError = require('../utils/appError');

const createConversation = async (body) => {
  const senderId = body.senderId;
  const receiverId = body.receiverId;
  const converId = (senderId.localeCompare(receiverId) === 1) ? (senderId + receiverId) : (receiverId + senderId);
  const conversation = await Conversation.findOne({
    _id: converId
  })
  console.log("conversationService", conversation)
  if (conversation) {
    return conversation;
  }
  const sender = await Account.findById(senderId);
  const receiver = await Account.findById(receiverId);
  const data = {
    _id: converId,
    conversationName: sender.fullname + ', ' + receiver.fullname,
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
    members: { $in: accounId }
  }).populate ('members','_id fullname avatar')
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

const removeVN = (Text) => {
  return Text.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
};
const searchConversations = async (data) => {
  const page = data?.page * 1 || 1;
  const limit = data?.limit * 1 || 10;
  const skip = (page - 1) * limit;
  let searchField = data.keyword;
  searchField = removeVN(searchField);
  let keyword = new RegExp(
      searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
      'i'
  );
  const listConvers = await Conversation.find();
  const conversations = listConvers.map((conversation) => {
      if (removeVN(conversation.conversationName).match(keyword)) {
          return conversation;
      }
  });
  const converIds = map(conversations, 'id');
  const result = await Article.find({ _id: { $in: converIds } })
      .skip(skip)
      .limit(limit)
      .exec();
  const count = await Conversation.find({ _id: { $in: converIds } }).count();
  return {
      listData: result,
      total: count,
  };
};
module.exports = {
  createConversation,
  getConversation,
  getListConversations,
  searchConversations,
}
