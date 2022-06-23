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
            conversation: {
                type: String,
            },
            sender: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Account',
            },
            text: {
                type: String,
            },
            isSeen: {
                type: Boolean,
                default: false,
            },
            isDelete: {
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: String,
            },
        },
        amountOfNotSeenMess: {
            type: Number,
        },
    },
    { timestamps: true }
);
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
