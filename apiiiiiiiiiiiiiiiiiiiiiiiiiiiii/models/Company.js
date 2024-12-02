const mongoose = require('mongoose');

// Trade schema for storing information about trades the company has won and participated in
const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade', // Reference to the Trade model
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
});

// Company schema
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    // Add this field to the existing companySchema
password: {
    type: String,
    required: true,
    minlength: 6
  }
,  
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^\+?(\d.*){3,}$/, 'Please enter a valid phone number']
    },
    apiKey: {
        type: String,
        required: true,
        unique: true,
        default: () => require('uuid').v4() // Generate a unique API key using UUID
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    tradesWon: [tradeSchema], // Stores the trades the company has won
    tradeHistory: [tradeSchema], // Stores the trades the company participated in (whether won or lost)
    bulkOrders: [{
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order' // Reference to the Order model
        },
        quantity: {
            type: Number,
            required: true
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'delivered'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `updatedAt` on save
companySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the Company model
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
