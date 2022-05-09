const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        conversationName: {
            type: String,
        },
        members: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Account',
            },
        ],
        latestMessage: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Message',
        },
        amountOfNotSeenMess: {
            type: Number,
        },
    },
    { timestamps: true }
);
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
