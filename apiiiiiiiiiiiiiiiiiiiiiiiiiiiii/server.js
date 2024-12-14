require('dotenv').config();
console.log('Environment check:', {
  mailgunApiPresent: !!process.env.mailgun_api,
  nodeEnv: process.env.NODE_ENV
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const auth = require('./middleware/auth');
const trades = require('./trades');

// Import routes
const companyRoutes = require('./routes/companyRoutes');
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
const uploadRoutes = require('./routes/uploadRoutes');

// Import controllers
const fileUploadController = require('./controllers/fileuploadController');
const productController = require('./controllers/productController');

// WebSocket setup
const WebSocket = require('ws');
const uuid = require('uuid');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5009'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect('mongodb+srv://Harsh:Garima@swastik.ikw5v.mongodb.net/swastik')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Set up upload directory
const UPLOAD_DIR = '/home/ec2-user/uploads';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/useraddress', addressRoutes);
app.use('/api/orderstatus', orderstatusRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/trades', tradeRoutes);

// Serve static files
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

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const tradeId = req.url.split('/').pop();
  
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
      const offerDetails = JSON.parse(message);
      if (offerDetails.amount <= trade.lastOfferAmount) {
        ws.send(JSON.stringify({ error: 'Offer must be higher than the last one.' }));
        return;
      }
      await addOffer(tradeId, offerDetails);
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

// Start the server
const port = 5009;
app.listen(port, () => console.log(`Server running on port ${port}`));
