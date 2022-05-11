const EVENT_MESSAGE_CSS = require('../events/client/message');
const EVENT_MESSAGE_SSC = require('../events/server/message');
const message = require('../../services/message.service');
const conversation = require('../../services/conversation.service');
const { includes} = require('lodash')

function MessageHandler(socket) {
  const listens = {};
  listens[EVENT_MESSAGE_CSS.SEND_MESSAGE_CSS] = async (payload) => {
    socket
      .to(payload.conversation)
      .emit(EVENT_MESSAGE_SSC.SEND_MESSAGE_SSC, {
        data: payload,
        msg: 'send mess room success',
        status: 200,
      });
  };

  listens[EVENT_MESSAGE_CSS.JOIN_ROOM_CSS] = async (payload) => {
    const { senderId, receiverId } = payload;
    const receiverIds = await conversation.getListReceiverId(senderId);
    if(!(receiverIds.includes(receiverId))){
      receiverIds.push(receiverId)
    }
    receiverIds.map(async (receiverId) => {
      const data = { senderId, receiverId };
      const conver = (await conversation.createConversation(data)) || '';
      // console.log('res', res);
      socket.join(conver._id);
      socket.to(conver._id).emit(EVENT_MESSAGE_SSC.JOIN_ROOM_SSC, {
        data: payload,
        msg: 'joined room success',
        status: 200,
      });
    })
  };

  listens[EVENT_MESSAGE_CSS.LEAVE_ROOM_CSS] = (payload) => {
    socket.leave(payload.room);
    socket.to(payload.room).emit(EVENT_MESSAGE_SSC.LEAVE_ROOM_SSC, {
      data: null,
      msg: 'leave room success',
      status: 200,
    });
  };

  return listens;
}

module.exports = MessageHandler;
