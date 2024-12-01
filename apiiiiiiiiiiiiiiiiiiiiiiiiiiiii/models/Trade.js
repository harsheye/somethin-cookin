const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId, // Assuming the farmer ID is an ObjectId
    required: true,
    ref: 'Farmer' // Reference to a Farmer collection
  },
  trades: [
    {
      companyName: {
        type: String,
        required: true,
        trim: true
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming the company ID is an ObjectId
        required: true,
        ref: 'Company' // Reference to a Company collection
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      timestamp: {
        type: Date,
        default: Date.now // Automatically records the time of the trade
      }
    }
  ],
  finalTrade: {
    companyName: {
      type: String, // Finalized company's name
      trim: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId, // Finalized company's ID
      ref: 'Company'
    },
    amount: {
      type: Number, // Finalized amount
      min: 0
    },
    timestamp: {
      type: Date, // Finalized trade time
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed'], // Only 'open' or 'closed' allowed
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
