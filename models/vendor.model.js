const mongoose = require('mongoose');

const VendorSchema = mongoose.Schema({
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    require: false,
  },
  accType: {
    package: mongoose.SchemaTypes.ObjectId,
    duration: Number,
  },
  articleNumber: Number,
  articlePerMonth: Number,
});

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = Vendor;
