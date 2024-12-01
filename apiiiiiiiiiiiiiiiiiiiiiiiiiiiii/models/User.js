const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  basicDetails: {
    authentication: {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      email: { type: String, required: true, unique: true }
    },
    profile: {
      mobileNo: String,
      name: String,
      pincode: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    userRole: {
      type: String,
      enum: ['customer', 'farmer', 'admin', 'service_provider'],
      default: 'customer'
    }
  },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  orders: [
    {
      orderId: Number, // Unique Order Identifier
      status: String, // Order Status
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product
          quantity: Number, // Quantity of product in this order
        }
      ],
      totalPrice: Number, // Total price of the order
    }
  ],
  addresses: [{
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  chats: {
    type: Map,
    of: new mongoose.Schema({
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      lastMessageStatus: String,
      chatCode: String
    }),
    default: new Map()
  },
  productsToBeReviewed: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      isReviewed: { type: Boolean, default: false },
    },
  ]
});

module.exports = mongoose.model('User', userSchema);