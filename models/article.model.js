const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  district: String,
  ward: String,
  street: String,
  image: [String],
  price: Number,
  area: Number,
  location: {
    latitude: Number,
    longitude: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  lessor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDateService: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  servicePackageId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ServicePackage',
  },
  endDateService: {
    type: Date,
  },
  isDelete:{
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  }
})
ArticleSchema.index({title: 'text'});
const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;