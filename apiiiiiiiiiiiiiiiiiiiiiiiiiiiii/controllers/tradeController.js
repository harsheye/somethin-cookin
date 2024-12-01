// controllers/tradeController.js
const uuid = require('uuid');
const Trade = require('../models/Trade');
const Farmer = require('../models/Farmer');  // Import the Farmer model

// Define trades as a Map to track trades
// Import the shared trades map
const trades = require('../trades');

exports.createTrade = async (req, res) => {
  const tradeId = uuid.v4();
  const tradeUrl = `ws://localhost:8080/trade/${tradeId}`;

  // Get the farmerId from the decoded JWT token (from the auth middleware)
  const { userId: farmerId } = req.user;  // Assuming the JWT contains the farmer's userId as farmerId

  try {
    // Fetch the farmer details from the database using the farmerId
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Check if the farmer already has an open trade
    const openTrade = farmer.trades.find(trade => trade.status === 'open');
    if (openTrade) {
      return res.status(400).json({ message: 'Farmer already has an open trade.' });
    }

    // Create a new trade entry in the database
    const newTrade = new Trade({
      cropName: req.body.cropName,
      quantityInTons: req.body.quantityInTons,
      farmerName: farmer.basicDetails.profile.name,
      farmerId
    });

    await newTrade.save();

    // Add the trade to the in-memory map
    trades.set(tradeId, { ws: null, timer: null, lastOfferAmount: 0 });

    // Save trade information in the farmer's collection
    farmer.trades.push({
      tradeId: newTrade._id,
      status: 'open',
      cropName: req.body.cropName,
      quantityInTons: req.body.quantityInTons
    });
    await farmer.save();

    console.log(`Trade created with ID: ${tradeId}, WebSocket URL: ${tradeUrl}`);

    // Respond with the created trade and WebSocket URL
    res.status(201).json({
      message: 'Trade created successfully',
      tradeId,
      tradeUrl
    });
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ message: 'Error creating trade', error: error.message });
  }
};
