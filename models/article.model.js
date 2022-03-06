const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    district: Number,
    ward: Number,
    street: Number,
  },
  image: [String],
  price: {
    cost: Number,
    //currency: Number,
  },
  area: Number,
  location: {
    latitude: Number,
    longtitude: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  vendorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Vendor',
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
  }
  
})

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;