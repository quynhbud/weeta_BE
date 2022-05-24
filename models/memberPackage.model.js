const mongoose = require('mongoose');

const MemberPackageSchema = mongoose.Schema(
    {
        memberPackageName: {
            type: String,
        },
        articlePerMonth: Number,
        price: Number,
    },
    {
        timestamps: true,
    }
);

const MemberPackage = mongoose.model('member-packages', MemberPackageSchema);
module.exports = MemberPackage;
