const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String,
  images: [{
    type: String,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5']
  }],
  videoLink: String,
  timestamp: { type: Date, default: Date.now }
});

function arrayLimit(val) {
  return val.length <= 5;
}



const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: Number,
    required: true
  },
  smallestSellingUnit: {
    type: Number,
    required: true
  },
  isForSale: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'grain'],
    required: true
  },
  totalRating: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  chats: {
    type: Map,
    of: new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      chatCode: String,
      lastMessageStatus: String,
      messages: [{
        sender: String,
        message: String,
        timestamp: Date
      }]
    }),
    default: new Map()
  }
  
});

module.exports = mongoose.model('Product', productSchema);