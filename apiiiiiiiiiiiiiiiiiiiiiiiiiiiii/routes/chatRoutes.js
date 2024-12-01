const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');  
const authorize = require('../middleware/authorize');

// Protect all routes with authentication and authorization


router.post('/initiate-chat',auth, chatController.initiateChat);
router.post('/send-message',auth, chatController.sendMessage);
router.get('/get-messages/:productId',auth, chatController.getMessages);

router.get('/test', (req, res) => {
  res.json({ message: 'Chat routes are working' });
});

module.exports = router;