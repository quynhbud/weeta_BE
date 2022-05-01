const mongoose = require('mongoose');

const MessageSchema =  new mongoose.Schema(
  {
    conversation: {
      type: String
    },
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account'
    },
    text: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    
  },
  {timestamps: true}
);

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;