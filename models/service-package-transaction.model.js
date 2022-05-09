const mongoose = require('mongoose');

const ServiceTransactionSchema = new mongoose.Schema(
    {
        lessorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
        transactionId: { type: Number, default: 0 },
        servicePackageName: {
            type: String,
        },
        articleId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Article' },
        transactionAmount: {
            type: Number,
            require: true,
        },
        status: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});
var counter = mongoose.model('counter', CounterSchema);

ServiceTransactionSchema.pre('save', function (next) {
    var doc = this;
    counter.findByIdAndUpdate(
        { _id: 'entityId' },
        { $inc: { seq: 1 } },
        function (error, counter) {
            if (error) return next(error);
            doc.transactionId = counter.seq;
            next();
        }
    );
});
const serviceTrans = mongoose.model(
    'service-package-transaction',
    ServiceTransactionSchema
);
module.exports = serviceTrans;
