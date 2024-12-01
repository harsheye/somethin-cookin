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
  
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // This remains an array

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
      totalEarnings: Number, // Add the products field
      timestamp: { type: Date, default: Date.now }
    })
  }
});

module.exports = mongoose.model('Farmer', farmerSchema);
