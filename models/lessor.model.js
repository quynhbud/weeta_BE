const { string, boolean } = require('joi');
const mongoose = require('mongoose');

const LessorSchema = mongoose.Schema(
    {
        account: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Account',
            require: false,
        },
        memberPackageId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'MemberPackage',
            require: false,
            default: '623ebe63be8ccfccc67bd97a',
        },
        memberPackage: {
            type: String,
            enum: ['FREE', 'SAVE', 'STANDARD', 'PREMIUM'],
            default: 'FREE',
        },
        articleTotal: {
            type: Number,
            default: 3,
        },
        articleUsed: {
            type: Number,
            default: 0,
        },
        isNeedAutoApproved: {
            type: Boolean,
            default: false,
        },
        isBan: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Lessor = mongoose.model('Lessor', LessorSchema);
module.exports = Lessor;
