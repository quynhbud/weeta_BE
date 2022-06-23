const httpStatus = require('http-status');
const { isEmpty } = require('lodash');
const Account = require('../models/account.model');
const { Conversation } = require('../models/index');
const AppError = require('../utils/appError');

const createConversation = async (body) => {
    const senderId = body.senderId;
    const receiverId = body.receiverId;

    //   console.log(senderId.localeCompare(receiverId))
    const conversationId =
        senderId.localeCompare(receiverId) === 1
            ? senderId + receiverId
            : receiverId + senderId;
    const conversation = await Conversation.findOne({
        _id: conversationId,
    }).populate('members', '_id fullname avatar');
    // .populate('latestMessage', '_id text isSeen isDelete createdAt');
    //   console.log("conversationService", conversation)
    if (conversation) {
        return conversation;
    }
    const data = {
        _id: conversationId,
        members: [body.senderId, body.receiverId],
    };
    await Conversation.create(data);
    return await Conversation.findOne({
        _id: conversationId,
    }).populate('members', '_id fullname avatar');
    // .populate('latestMessage', '_id text isSeen isDelete createdAt');
};

const updateConversation = async (conversationId, body) => {
    const conversation = await Conversation.findOne({
        _id: conversationId,
    });
    if (!conversation) {
        return AppError(httpStatus.NOT_FOUND, 'Không tìm thấy cuộc hội thoại');
    }
    Object.assign(conversation, body);
    return await conversation.save();
};

const getConversation = async (memberId) => {
    const conversation = await Conversation.find({
        members: { $in: memberId },
    });
    return conversation;
};

const getListConversations = async (data, accountId) => {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const skip = (page - 1) * limit;
    const conversations = await Conversation.find({
        members: { $in: accountId },
    })
        .populate('members', '_id fullname avatar')
        // .populate('latestMessage', '_id text isSeen isDelete createdAt')
        .skip(skip)
        .limit(limit)
        .sort({ 'latestMessage.createdAt': 'desc' })
        .exec();
    const totalConversation = await Conversation.find({
        members: { $in: [accountId.toString()] },
    }).count();
    let isOver = false;
    if (page * limit >= totalConversation || isEmpty(conversations)) {
        isOver = true;
    }
    const result = {
        data: conversations,
        total: totalConversation,
        isOver: isOver,
    };
    return result;
};

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
const getListReceiverId = async (senderId) => {
    const conversations = await Conversation.find({
        members: { $in: senderId },
    });
    let receiverIds = [];
    conversations.map((conver) => {
        const { members } = conver;
        const receiverId = members.filter((o) => {
            return o != senderId;
        });
        receiverIds.push(receiverId.toString());
    });
    return receiverIds;
};
module.exports = {
    createConversation,
    updateConversation,
    getConversation,
    getListConversations,
    searchConversations,
    getListReceiverId,
};
