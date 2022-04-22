const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

// create conversation
const createConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.createConversation(req.body);
  if(!conversation){
    return sendError(res, httpStatus.BAD_REQUEST, 'Create conversation fail');
  }
  sendSuccess(res, conversation, httpStatus.CREATED, 'conversation created');
});

// get conver of user
const getConversation = catchAsync(async (req, res) => {
  const memberId = [req.params.memberId];
  const conversation = await conversationService.getConversation(memberId);
  if(!conversation){
    return sendError(res, httpStatus.NOT_FOUND, 'get conversation faild');
  }
  sendSuccess(res, conversation, httpStatus.CREATED, 'get conversation successfully');
});
module.exports = {
  createConversation,
  getConversation
}