// const mongoose = require('mongoose');

// const MemberTransactionSchema = new mongoose.Schema(
//     {
//         lessorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
//         transactionId: { type: Number, default: 0 },
//         memberPackageName: {
//             type: String,
//         },
//         transactionAmount: {
//             type: Number,
//             require: true,
//         },
//         status: {
//             type: String,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const CounterSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     seq: { type: Number, default: 0 },
// });
// var counter = mongoose.model('counter', CounterSchema);

// MemberTransactionSchema.pre('save', function (next) {
//     var doc = this;
//     counter.findByIdAndUpdate(
//         { _id: 'entityId' },
//         { $inc: { seq: 1 } },
//         function (error, counter) {
//             if (error) return next(error);
//             doc.transactionId = counter.seq;
//             next();
//         }
//     );
// });
// const memberTrans = mongoose.model(
//     'member-package-transaction',
//     MemberTransactionSchema
// );
// module.exports = memberTrans;
