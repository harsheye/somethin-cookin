const User = require('../models/User');
const Product = require('../models/Product');
const crypto = require('crypto');

function encryptMessage(message, chatCode) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(chatCode, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptMessage(encryptedMessage, chatCode) {
  const [ivHex, encryptedHex] = encryptedMessage.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(chatCode, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.initiateChat = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;
    console.log(userId);
    console.log(productId);
    const customer = await User.findById(userId);
    const product = await Product.findById(productId);
    console.log(customer.basicDetails.userRole);
    if (!customer || !product || customer.basicDetails.userRole !== 'customer') {
      return res.status(400).json({ message: 'Invalid customer or product' });
    }

    const chatCode = crypto.randomBytes(16).toString('hex');
    
    // Update customer's chats
    customer.chats.set(product.farmer.toString(), {
      product: productId,
      lastMessageStatus: 'sent',
      chatCode: chatCode
    });
    try {

        await customer.save();
    }
    catch (error){
        console.log(error);        
    }

    // Update product's chats
    product.chats.set(userId, {
      user: userId,
      chatCode: chatCode,
      lastMessageStatus: 'received',
      messages: []
    });
    try {
        await product.save();

    }
    catch (error){
        console.log(error);        
    }

    res.status(200).json({ message: 'Chat initiated successfully', chatCode });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating chat', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { productId, message } = req.body;
    const senderId = req.user.userId;

    const sender = await User.findById(senderId);
    const product = await Product.findById(productId);
    const isSenderCustomer = sender.basicDetails.userRole === 'customer';
    const chatPartnerId = isSenderCustomer ? product.farmer.toString() : senderId;


     // Get the chatCode from the sender's chats
     const chatCode = sender.chats.get(chatPartnerId)?.chatCode; 


     if (!chatCode) {
         return res.status(400).json({ message: 'Chat not found' });
       }
     
 
     if (!sender || !product) {
       return res.status(400).json({ message: 'Invalid sender or product' });
     }

    // Encrypt the message
    const encryptedMessage = encryptMessage(message, chatCode);

    // Update product's chat
    const productChat = product.chats.get(isSenderCustomer ? senderId : chatPartnerId);
    if (!productChat || productChat.chatCode !== chatCode) {
      return res.status(400).json({ message: 'Invalid chat' });
    }

    productChat.messages.push({
      sender: isSenderCustomer ? 'customer' : 'farmer',
      message: encryptedMessage,
      timestamp: new Date()
    });
    productChat.lastMessageStatus = isSenderCustomer ? 'received' : 'sent';
    await product.save();

    // Update sender's chat status
    sender.chats.get(chatPartnerId).lastMessageStatus = 'sent';
    await sender.save();

    // Update receiver's chat status
    const receiver = await User.findById(chatPartnerId);
    receiver.chats.get(senderId).lastMessageStatus = 'received';
    await receiver.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(400).json({ message: 'Invalid user or product' });
    }

    const isCustomer = user.basicDetails.userRole === 'customer';
    const chatPartnerId = isCustomer ? product.farmer.toString() : userId;

    const chat = product.chats.get(isCustomer ? userId : chatPartnerId);
    if (!chat) {
      return res.status(400).json({ message: 'Chat not found' });
    }

    const chatCode = user.chats.get(chatPartnerId).chatCode;

    // Decrypt messages
    const decryptedMessages = chat.messages.map(msg => ({
      ...msg.toObject(),
      message: decryptMessage(msg.message, chatCode)
    }));

    res.status(200).json({ messages: decryptedMessages });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};