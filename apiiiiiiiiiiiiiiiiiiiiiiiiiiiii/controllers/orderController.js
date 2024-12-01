
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
require('dotenv').config();

// Mailgun Client Configuration
const mg = mailgun.client({
  username: 'api',
  key: process.env.mailgun_api // Use your own Mailgun API key
});

// Here's how to fix the sendEmail function to ensure it sends the sophisticated version:

const sendEmail = async (recipientEmail, orderDetails) => {
  const { orderId, products, totalPrice, address } = orderDetails;

  let productDetailsHTML = products.map(product => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${(product.price * product.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  // The sophisticated email template
  const emailHTML = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #FF6D05; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">OnlineSBII</h1>
          </div>
          <div style="padding: 20px;">
            <h1 style="color: #333333; text-align: center;">Order Confirmation</h1>
            <p style="color: #666666; text-align: center;">Thank you for your order! Here's a summary of your purchase.</p>
            
            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 15px; margin-top: 20px;">
              <h2 style="color: #FF6D05; margin-bottom: 10px;">Order #${orderId}</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #FF6D05; color: white;">
                    <th style="padding: 10px; text-align: left;">Product Name</th>
                    <th style="padding: 10px; text-align: left;">Quantity</th>
                    <th style="padding: 10px; text-align: left;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productDetailsHTML}
                  <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px; font-weight: bold;">₹${totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="margin-top: 20px;">
              <h3 style="color: #333333;">Shipping Address:</h3>
              <p style="color: #666666;">
                ${address.name}<br>
                ${address.street}<br>
                ${address.city}, ${address.state} ${address.zipCode}<br>
                ${address.country}
              </p>
            </div>

            <p style="color: #666666; text-align: center; margin-top: 20px;">
              We'll process your order shortly and send you tracking information once it's shipped.
            </p>
          </div>
          
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
            <p>If you have any questions, please contact our customer support.</p>
            <p>&copy; 2024 OnlineSBII. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Important: All styles must be inline to ensure email client compatibility
  const emailData = {
    from: "OnlineSBII Orders <orders@onlinesbii.live>",
    to: recipientEmail,
    subject: `Your OnlineSBII Order #${orderId} Confirmation`,
    html: emailHTML
  };

  try {
    // Make sure to log the actual HTML being sent for debugging
    console.log('Sending email with HTML:', emailHTML);
    
    const result = await mg.messages.create('onlinesbii.live', emailData);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};



exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  let newOrder;

  try {
    const user = await User.findById(req.user.userId)
      .select('cart addresses basicDetails.authentication.email')
      .session(session)
      .lean();

    if (!user) throw new Error('User not found');
    if (!user.cart || user.cart.length === 0) throw new Error('Cart is empty');

    const defaultAddress = user.addresses.find(address => address.isDefault);
    if (!defaultAddress) throw new Error('No default address found');

    const productIds = user.cart.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name price unit farmer')
      .session(session)
      .lean();

    let totalPrice = 0;
    const orderProducts = [];
    const productUpdates = [];
    const farmerUpdates = {};

    for (const item of user.cart) {
      const product = products.find(p => p._id.toString() === item.product.toString());

      if (!product) {
        console.error(`Product not found: ${item.product}`);
        continue;
      }

      if (product.unit < item.quantity) throw new Error(`Insufficient stock for product: ${product.name}`);

      totalPrice += product.price * item.quantity;
      orderProducts.push({ product: product._id, quantity: item.quantity });

      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { unit: -item.quantity } }
        }
      });

      const farmerId = product.farmer.toString();
      if (!farmerUpdates[farmerId]) {
        farmerUpdates[farmerId] = { products: [], totalEarnings: 0 };
      }
      farmerUpdates[farmerId].products.push({ product: product._id, quantity: item.quantity });
      farmerUpdates[farmerId].totalEarnings += product.price * item.quantity;
    }

    if (orderProducts.length === 0) throw new Error('No valid products found in the cart to place the order.');

    newOrder = new Order({
      orderId: Date.now(),
      user: req.user.userId,
      products: orderProducts,
      totalPrice,
      status: 'initiated',
      address: defaultAddress
    });

    await newOrder.save({ session });

    await Product.bulkWrite(productUpdates, { session });

    for (const farmerId in farmerUpdates) {
      await Farmer.findByIdAndUpdate(farmerId, {
        $set: {
          [`ordersReceived.${newOrder._id}`]: {
            order: newOrder._id,
            products: farmerUpdates[farmerId].products,
            totalEarnings: farmerUpdates[farmerId].totalEarnings,
            timestamp: new Date()
          }
        }
      }, { session });
    }

    // Inside the createOrder function, replace the existing sendEmail call with:
await sendEmail(user.basicDetails.authentication.email, {
  orderId: newOrder.orderId,
  products: orderProducts.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    return {
      name: product.name,
      quantity: item.quantity,
      price: product.price
    };
  }),
  totalPrice,
  address: defaultAddress
});

    await User.findByIdAndUpdate(req.user.userId, {
      $set: { cart: [] },
      $push: { orders: newOrder._id }
    }, { session });

    await session.commitTransaction();

    res.json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error placing order:', error);

    if (newOrder && newOrder._id) {
      await Order.deleteOne({ _id: newOrder._id }).session(session);
      for (const farmerId in farmerUpdates) {
        await Farmer.findByIdAndUpdate(farmerId, {
          $unset: { [`ordersReceived.${newOrder._id}`]: "" }
        }, { session });
      }
    }

    res.status(400).json({ error: error.message || 'An error occurred while placing the order' });
  } finally {
    session.endSession();
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log('Fetching order with ID:', orderId);

    const order = await Order.findOne({ orderId: Number(orderId) })
      .populate('user', 'name email')
      .populate('products.product', 'name price')
      .lean();

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ error: 'Order not found.' });
    }

    const user = await User.findById(req.user.userId).select('_id').lean();

    if (!user) {
      console.log('User not found');
      return res.status(403).json({ error: 'User not found.' });
    }

    if (order.user._id.toString() !== user._id.toString()) {
      console.log('Access denied for order:', orderId);
      return res.status(403).json({ error: 'Access denied. You do not have permission to view this order.' });
    }

    const orderDetails = {
      orderId: order.orderId,
      user: {
        id: order.user._id,
        name: order.user.name,
        email: order.user.email
      },
      products: order.products.map(p => ({
        id: p.product._id,
        name: p.product.name,
        price: p.product.price,
        quantity: p.quantity
      })),
      status: order.status,
      totalPrice: order.totalPrice,
      timestamp: order.timestamp,
      address: order.address
    };

    console.log('Order details fetched:', orderDetails);
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order.' });
  }
};
