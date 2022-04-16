const mongoose = require('mongoose');

const ConversationSchema =  new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    members: {
      type: Array,
    },
  },
  {timestamps: true}
);
const Conversation = mongoose.model('conversation', ConversationSchema);
module.exports = Conversation;