const mongoose = require('mongoose');
const uuid = require('uuid'); // For generating unique trade IDs

const tradeSchema = new mongoose.Schema({
  tradeId: {
    type: String,
    default: () => uuid.v4(), // Automatically generate UUID for each trade
    unique: true, // Ensure uniqueness
    required: true
  },
  cropName: {
    type: String,
    required: true,
    trim: true
  },
  quantityInTons: {
    type: Number,
    required: true,
    min: 0
  },
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Farmer'
  },
  trades: [
    {
      tradeId: {
        type: String, // Each trade will have its own unique ID
        required: true
      },
      companyName: {
        type: String,
        required: true,
        trim: true
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  finalTrade: {
    tradeId: {
      type: String,
      required: false // May be null until finalized
    },
    companyName: {
      type: String,
      trim: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    amount: {
      type: Number,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
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
tradeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
