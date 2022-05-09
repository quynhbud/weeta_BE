const mongoose = require('mongoose');

const MemberPackageSchema = mongoose.Schema(
    {
        serviceName: {
            type: String,
        },
        articlePerMonth: Number,
        price: Number,
    },
    {
        timestamps: true,
    }
);

const MemberPackage = mongoose.model('MemberPackage', MemberPackageSchema);
module.exports = MemberPackage;
