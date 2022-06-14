const mongoose = require('mongoose');
const validator = require('validator');
const { roles } = require('../config/roles');
const bcrypt = require('bcryptjs');

const AccountSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (val) {
                    return val.match(/^(84|0[3|5|7|8|9|1|2|4|6])+([0-9]{8})$/);
                },
                message: 'Number phone {VALUE} is invalid. Please try again.',
            },
        },
        introduction: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error(
                        'Password must contain at least one letter and one number'
                    );
                }
            },
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            enum: roles,
            default: roles[0],
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            default: 'male',
        },
        avatar: {
            type: String,
            required: false,
            default:
                'https://firebasestorage.googleapis.com/v0/b/weeta-housing.appspot.com/o/avatar_default.png?alt=media&token=34619e46-80b6-45e5-b8ce-760d618db094',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
        isAutoApproved: {
            type: Boolean,
            default: false,
        },
        IDCard: {
            type: [String],
        },
        saveArticle: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Article',
            },
        ],
        accountType: {
            type: String,
            enum: ['normal', 'google', 'facebook'],
            default: 'normal',
        },
    },
    {
        timestamps: true,
    }
);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
AccountSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const account = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!account;
};

AccountSchema.statics.usernameExists = async function (
    username,
    excludeUserId
) {
    const account = await this.findOne({
        username,
        _id: { $ne: excludeUserId },
    });
    return !!account;
};

AccountSchema.statics.isPhoneTaken = async function (
    phoneNumber,
    excludeUserId
) {
    const account = await this.findOne({
        phoneNumber,
        _id: { $ne: excludeUserId },
    });
    return !!account;
};
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
AccountSchema.methods.isPasswordMatch = async function (password) {
    const account = this;
    return bcrypt.compare(password, account.password);
};

AccountSchema.pre('save', async function (next) {
    const account = this;
    if (account.isModified('password')) {
        account.password = await bcrypt.hash(account.password, 8);
    }
    next();
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
