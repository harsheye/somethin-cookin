const User = require('../models/User');
const Product = require('../models/Product'); // Ensure you have the Product model

exports.getCartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate({
      path: 'cart.product',
      select: 'name description price farmer'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the cart exists and is an array
    if (!user.cart || !Array.isArray(user.cart)) {
      return res.status(200).json([]); // Return an empty array if no cart items
    }

    // Format the cart items while checking for product existence
    const cartItems = user.cart.map(item => {
      if (item.product) {
        return {
          productId: item.product._id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          farmer: item.product.farmer,
          quantity: item.quantity
        };
      } else {
        return null; // If the product is not found, return null
      }
    }).filter(item => item !== null); // Remove any null items from the array

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart' });
  }
};


exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const product = await Product.findById(productId).select('isForSale');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isForSale) {
      return res.status(400).json({ error: 'Product is not for sale' });
    }

    const user = await User.findById(req.user.userId);
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding to the cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { cart: { product: productId } }
    });
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'An error occurred while removing from the cart' });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  try {
    const user = await User.findById(req.user.userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({ message: 'Cart item quantity updated successfully' });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart item quantity' });
  }
};

exports.incrementCartItemQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cartItem.quantity += 1;
    await user.save();

    res.json({ message: 'Cart item quantity incremented successfully' });
  } catch (error) {
    console.error('Error incrementing cart item quantity:', error);
    res.status(500).json({ error: 'An error occurred while incrementing the cart item quantity' });
  }
};

exports.decrementCartItemQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await user.save();
      res.json({ message: 'Cart item quantity decremented successfully' });
    } else {
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
      await user.save();
      res.json({ message: 'Product removed from cart' });
    }
  } catch (error) {
    console.error('Error decrementing cart item quantity:', error);
    res.status(500).json({ error: 'An error occurred while decrementing the cart item quantity' });
  }
};
