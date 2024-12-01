const mongoose = require('mongoose');
const userSchema = require('./User').schema;

const farmerSchema = new mongoose.Schema({
  basicDetails: {
    ...userSchema.obj.basicDetails,
    profile: {
      ...userSchema.obj.basicDetails.profile,
      selfieUrl: String // Add this line to store the selfie URL
    }
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  ordersReceived: {
    type: Map,
    of: new mongoose.Schema({
      order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      products: [
        { 
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
          quantity: Number 
        }
      ], 
      totalEarnings: Number,
      timestamp: { type: Date, default: Date.now }
    })
  },
  trades: [
    {
      tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' },
      status: { type: String, enum: ['open', 'closed'], default: 'open' },
      createdAt: { type: Date, default: Date.now },
      cropName: { type: String },
      quantityInTons: { type: Number }
    }
  ]
});

module.exports = mongoose.model('Farmer', farmerSchema);