const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const auth = require('./middleware/auth');
const trades = require('./trades');



const emailRoutes = require('./routes/emailRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressesRoutes');
const orderstatusRoutes = require('./routes/orderstatusRoutes');
const { router: fileUploadRouter, upload } = require('./controllers/fileuploadController');
const sendEmail = require('./controllers/component/sendEmail');
const productController = require('./controllers/productController');

//
//  for web socket
//
const WebSocket = require('ws');
const uuid = require('uuid');


//
//
// end of 
//

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Apply CORS with options

// MongoDB connection
mongoose.connect('mongodb://localhost:44275/swastik')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Set up upload directory
const UPLOAD_DIR = '/home/ec2-user/uploads';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farmer', (req, res, next) => {
  console.log('Farmer route accessed:', req.method, req.path);
  farmerRoutes(req, res, next);
});
app.use('/api/chat', chatRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/useraddress', addressRoutes);
app.use('/api/orderstatus', orderstatusRoutes);


// File upload routes
app.use('/api/upload', fileUploadRouter);
app.use('/api', emailRoutes);
app.use('/api/trades', tradeRoutes);


// Specific route for farmer selfie upload
app.post('/api/upload/farmer-selfie', auth, upload.single('selfie'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No selfie uploaded' });
  }
  const selfieUrl = `/uploads/selfies/${req.user.userId}/${req.file.filename}`;
  res.json({
    message: 'Farmer selfie uploaded successfully',
    selfieUrl: selfieUrl
  });
});

// Serve static files from the upload directory
app.use('/uploads', express.static(UPLOAD_DIR));



// Product search route
app.get('/api/products/search', async (req, res) => {
  try {
    await productController.searchProducts(req, res);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});





// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket Server running on ws://localhost:8080");



// Generate WebSocket URL for a trade
function generateTradeUrl() {
  return `ws://localhost:8080/trade/${uuid.v4()}`;
}

// Handle WebSocket connection
wss.on('connection', (ws, req) => {
  const tradeId = req.url.split('/').pop();
  
  // Ensure that the trade exists before connecting
  if (!trades.has(tradeId)) {
    console.error(`Invalid WebSocket connection attempt for trade ID: ${tradeId}`);
    ws.close();
    return;
  }

  const trade = trades.get(tradeId);
  trade.ws = ws;
  console.log(`Trade WebSocket opened for trade ID: ${tradeId}`);

  ws.on('message', async (message) => {
    console.log(`Received message for trade ${tradeId}: ${message}`);
    
    try {
      const offerDetails = JSON.parse(message); // Assuming JSON format

      // Validate the offer amount
      if (offerDetails.amount <= trade.lastOfferAmount) {
        ws.send(JSON.stringify({ error: 'Offer must be higher than the last one.' }));
        return;
      }

      // Add the new offer to the trade
      await addOffer(tradeId, offerDetails);
      console.log(`Offer added for trade ${tradeId}:`, offerDetails);

      // Reset inactivity timer for this trade
      handleTradeActivity(tradeId);
    } catch (err) {
      console.error('Error processing trade offer:', err);
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket closed for trade ID: ${tradeId}`);
    trades.delete(tradeId);
  });
});

// Handle trade activity and reset the inactivity timer
function handleTradeActivity(tradeId) {
  if (!trades.has(tradeId)) return;

  const trade = trades.get(tradeId);

  // Clear the existing timer
  if (trade.timer) clearTimeout(trade.timer);

  // Set a new timer for 1 hour
  trade.timer = setTimeout(() => {
    finalizeTrade(tradeId); // Finalize the trade if no offers are received in 1 hour
  }, 60 * 60 * 1000); // 1 hour in milliseconds
}

// Close the trade if no activity (finalize it)
async function finalizeTrade(tradeId) {
  const trade = trades.get(tradeId);

  if (!trade) return;

  if (trade.ws) {
    trade.ws.close(); // Close WebSocket connection
  }

  // Finalize the trade with the last offer received
  if (trade.trades.length > 0) {
    const lastOffer = trade.trades[trade.trades.length - 1];
    trade.finalTrade = {
      companyName: lastOffer.companyName,
      companyId: lastOffer.companyId,
      amount: lastOffer.amount,
      timestamp: new Date()
    };
    trade.status = 'closed'; // Update status to closed
    await trade.save();
    console.log(`Trade ${tradeId} automatically closed after 1 hour of inactivity.`);
  }

  trades.delete(tradeId); // Remove trade from the map
}

// Add a new offer to the trade
async function addOffer(tradeId, offerDetails) {
  const trade = await Trade.findById(tradeId);

  if (!trade) {
    console.log('Trade not found');
    return;
  }

  // Add the offer to the trades array
  trade.trades.push({
    companyName: offerDetails.companyName,
    companyId: offerDetails.companyId,
    amount: offerDetails.amount,
    timestamp: new Date()
  });

  // Update the last offer amount
  trade.lastOfferAmount = offerDetails.amount;

  await trade.save();
  console.log('Offer added:', trade);
}




// Start the server
const port = 5009;
app.listen(port, () => console.log(`Server running on port ${port}`));
