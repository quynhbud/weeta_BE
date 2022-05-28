const mongoose = require('mongoose');

const MemberTransactionSchema = new mongoose.Schema(
    {
        lessorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
        memberPackageName: {
            type: String,
        },
        transactionAmount: {
            type: Number,
            require: true,
        },
        status: {
            type: String,
        },
        paymentMethod: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);
const memberTrans = mongoose.model(
    'member-package-transaction',
    MemberTransactionSchema
);
module.exports = memberTrans;
