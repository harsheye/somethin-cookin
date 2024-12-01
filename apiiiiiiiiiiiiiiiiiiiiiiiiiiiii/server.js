const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const auth = require('./middleware/auth');

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
mongoose.connect('mongodb+srv://Harsh:Garimais%3C3@swastik.ikw5v.mongodb.net/Swastik')
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

// Email route
app.post('/api/send-code', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const code = await sendEmail(email);
    res.json({ message: 'Verification code sent', code });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

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

// Map to track trades
const trades = new Map();

// Generate WebSocket URL for a trade
function generateTradeUrl() {
    return `ws://localhost:8080/trade/${uuid.v4()}`;
}

// Handle WebSocket connection
wss.on('connection', (ws, req) => {
    const tradeId = req.url.split('/').pop();

    if (!trades.has(tradeId)) {
        console.error(`Invalid WebSocket connection attempt for trade ID: ${tradeId}`);
        ws.close();
        return;
    }

    trades.get(tradeId).ws = ws;
    console.log(`Trade WebSocket opened for trade ID: ${tradeId}`);

    ws.on('message', (message) => {
        console.log(`Received message for trade ${tradeId}: ${message}`);
        handleTradeActivity(tradeId); // Reset inactivity timer
    });

    ws.on('close', () => {
        console.log(`WebSocket closed for trade ID: ${tradeId}`);
        trades.delete(tradeId); // Clean up the trade on WebSocket closure
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
        closeTrade(tradeId);
    }, 60 * 60 * 1000); // 1 hour in milliseconds
}

// Close a trade due to inactivity
function closeTrade(tradeId) {
    const trade = trades.get(tradeId);
    if (trade && trade.ws) {
        trade.ws.close(); // Close WebSocket connection
        console.log(`Trade ${tradeId} automatically closed after 1 hour of inactivity.`);
        trades.delete(tradeId); // Remove trade from the map
    }
}






// Create a new trade and generate a WebSocket URL
app.post('/api/trades/create', (req, res) => {
  const tradeId = uuid.v4();
  const tradeUrl = `ws://localhost:8080/trade/${tradeId}`;

  trades.set(tradeId, { ws: null, timer: null });
  console.log(`Trade created with ID: ${tradeId}, WebSocket URL: ${tradeUrl}`);

  res.status(201).json({
      message: 'Trade created successfully',
      tradeId,
      tradeUrl
  });
});

// Start the server
const port = 5009;
app.listen(port, () => console.log(`Server running on port ${port}`));
