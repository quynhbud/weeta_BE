const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Article' },
    accountId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
    review: {
      type: String,
    },
    rate: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model(
  'Review',
  ReviewSchema
);
module.exports = Review;