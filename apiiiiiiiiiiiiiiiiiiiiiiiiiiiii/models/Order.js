const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['initiated', 'packed', 'shipped', 'intransit', 'delivered', 'complete'],
    default: 'initiated'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  address: addressSchema
});

module.exports = mongoose.model('Order', orderSchema);