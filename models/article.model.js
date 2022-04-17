const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  district: Number,
  ward: Number,
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
  lessorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Lessor',
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
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  servicePackageId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'ServicePackage',
  },
  timeService: {
    type: Number,
  },
  isDelete:{
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  }
})

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;