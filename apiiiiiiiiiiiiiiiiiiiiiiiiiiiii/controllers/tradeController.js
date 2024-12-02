const uuid = require('uuid');
const Trade = require('../models/Trade');
const Farmer = require('../models/Farmer');
const trades = require('../trades'); // In-memory map for WebSocket tracking
const mongoose = require('mongoose');

exports.createTrade = async (req, res) => {
  const tradeId = uuid.v4();
  const tradeUrl = `ws://localhost:8080/trade/${tradeId}`;

  // Get the farmerId from the decoded JWT token (from the auth middleware)
  const { userId: farmerId } = req.user; // Assuming JWT contains farmer's userId

  try {
    console.log('FarmerId from JWT:', farmerId);
    const farmer = await Farmer.findById(farmerId);
    console.log('Farmer from DB:', farmer);

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Check if the farmer already has an open trade
    const openTrade = farmer.trades.find((trade) => trade.status === 'open');
    if (openTrade) {
      return res.status(400).json({ message: 'Farmer already has an open trade.' });
    }

    // Create the new trade
    const newTrade = new Trade({
      cropName: req.body.cropName,
      quantityInTons: req.body.quantityInTons,
      farmerName: farmer.basicDetails.profile.name,
      farmerId: farmer._id,
      tradeId, // Add generated UUID as tradeId
    });

    // Save the trade to the database
    await newTrade.save();

    // Add the trade to the farmer's trades array
    farmer.trades.push({
      tradeId: newTrade._id,
      status: 'open',
      cropName: req.body.cropName,
      quantityInTons: req.body.quantityInTons,
      createdAt: new Date(),
    });

    // Save the farmer with the updated trades array
    await farmer.save();

    console.log(`Trade created with ID: ${tradeId}, WebSocket URL: ${tradeUrl}`);

    // Respond with the created trade details and WebSocket URL
    res.status(201).json({
      message: 'Trade created successfully',
      tradeId,
      tradeUrl,
    });
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ message: 'Error creating trade', error: error.message });
  }
};

// Fetch trades
exports.getTrades = async (req, res) => {
  const { status } = req.query; // Optional status filter

  try {
    // Build the query dynamically
    const query = {};
    if (status) {
      query.status = status;
    }

    // Find and populate trades
    const trades = await Trade.find(query).populate('trades.companyId', 'companyName');
    res.status(200).json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Error fetching trades', error: error.message });
  }
};
