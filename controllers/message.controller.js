const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');
const { sendSuccess, sendError } = require('./return.controller');

// create message
const createMessage = catchAsync(async (req, res) => {
  const body =  req.body;
  const message = await messageService.createMessage(body);
  if(!message){
    sendError(res, httpStatus.BAD_REQUEST, 'Create message fail');
  }
  sendSuccess(res, message, httpStatus.CREATED, 'create message created');
});
//get message in conversation
const getMessage = catchAsync(async (req, res) => {
  const conversationId =  req.params.conversationId;
  const message = await messageService.getMessage({conversationId});
  if(!message){
    sendError(res, httpStatus.BAD_REQUEST, 'Get message fail');
  }
  sendSuccess(res, message, httpStatus.CREATED, 'Get message created');
});

module.exports = {
  createMessage,
  getMessage
}