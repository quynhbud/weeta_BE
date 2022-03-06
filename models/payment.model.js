const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
  paymentId: {
    type: String,
    require:false,
  },
  totalMoney: Number,
  months: Number,
  type:{
    type: String,
  },
  vendorId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Vendor',
  },
  createdAt: {
    type: Date,
    default: Date.now() 
  },
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;