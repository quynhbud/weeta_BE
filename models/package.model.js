const mongoose = require('mongoose');

const PackageSchema = mongoose.Schema({
  name: {
    type: String,
  },
  price: Number,
  articlePerMonth: Number,
});

const Package = mongoose.model('Package', PackageSchema);
module.exports = Package;