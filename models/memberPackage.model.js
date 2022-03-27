const mongoose = require('mongoose');

const MemberPackageSchema = mongoose.Schema({
  serviceName: {
    type: String,
  },
  articlePerMonth: Number,
  price: Number,
});

const MemberPackage = mongoose.model('member-package', MemberPackageSchema);
module.exports = MemberPackage;