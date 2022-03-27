const { string, boolean } = require('joi');
const mongoose = require('mongoose');

const LessorSchema = mongoose.Schema({
  lessorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    require: false,
  },
  memberPackageId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'MemberPackage',
    require: false,
  },
  articleTotal: {
    type: Number,
    default: 3,
  },
  articleUsed:{
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isBan: {
    type: Boolean,
    default: false,
  }
});

const Lessor = mongoose.model('Lessor', LessorSchema);
module.exports = Lessor;
