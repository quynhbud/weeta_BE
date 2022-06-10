const mongoose = require('mongoose');

const ReportReasonSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        type: {
            type: String,
            enum: ['article', 'lessor'],
            default: 'article',
        },
    },
    { timestamps: true }
);

const ReportReason = mongoose.model('ReportReason', ReportReasonSchema);
module.exports = ReportReason;
