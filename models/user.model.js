const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        accountId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Account',
            require: false,
        },
        saveArticle: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Article',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
