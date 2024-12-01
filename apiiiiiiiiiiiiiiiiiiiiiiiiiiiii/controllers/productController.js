const Product = require('../models/Product');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { deleteFiles } = require('./fileuploadController');
require('dotenv').config();

// Initialize the API key and model
let genAI;
let model;

function initializeAI() {
  try {
    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('Google Generative AI initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Google Generative AI:', error.message);
    return false;
  }
}

// Call the initialization function
const isAIInitialized = initializeAI();

// // API to get recommended words
// exports.getRecommendedWords = async (req, res) => {
//   try {
//     if (!isAIInitialized) {
//       throw new Error('Google Generative AI model is not initialized. Check your API key and environment variables.');
//     }

//     const searchQuery = req.query.q;

//     if (!searchQuery) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }

//     const prompt = `You are a helpful AI assistant. The user is searching for products related to vegetables, fruits, and grains based on the query "${searchQuery}". Suggest 5 relevant product names. Respond with a comma-separated list of exactly 5 product names. No explanations or additional text.`;

//     console.log('Sending prompt to Gemini API:', prompt);

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     const recommendedWords = text.split(',').map(word => word.trim());

//     console.log('Final recommended words:', recommendedWords);

//     res.json({ recommendedWords });
//   } catch (error) {
//     console.error('Error in getRecommendedWords:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// API to get recommended products with search
exports.getRecommendedProductsWithSearch = async (req, res) => {
  try {
    if (!isAIInitialized) {
      throw new Error('Google Generative AI model is not initialized. Check your API key and environment variables.');
    }

    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const prompt = `You are a helpful AI assistant. The user is searching for products related to vegetables, fruits, and grains based on the query "${searchQuery}". Suggest 5 relevant product names that are different from but similar to "${searchQuery}". Respond with a comma-separated list of exactly 5 product names. No explanations or additional text.`;

    console.log('Sending prompt to Google Generative AI:', prompt);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const recommendedWords = text.split(',').map(word => word.trim());

    console.log('Recommended words:', recommendedWords);

    const getRandomProduct = async (searchTerm) => {
      const searchRegex = new RegExp(searchTerm, 'i');
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      })
      .populate('farmer', 'basicDetails.profile.name')
      .limit(10)
      .lean();

      console.log(`Found ${products.length} products for search term "${searchTerm}"`);

      if (products.length === 0) return null;
      return products[Math.floor(Math.random() * products.length)];
    };

    const recommendedProducts = await Promise.all(
      recommendedWords.map(async (word) => {
        const product = await getRandomProduct(word);
        return product ? { recommendedWord: word, product } : null;
      })
    );

    const finalResults = recommendedProducts.filter(result => result !== null);
    console.log('Final recommended products:', finalResults);

    if (finalResults.length === 0) {
      return res.status(404).json({ message: 'No products found for the search query.', originalQuery: searchQuery, recommendedProducts: [] });
    }

    const formattedResults = finalResults.map(({ recommendedWord, product }) => ({
      recommendedWord: recommendedWord,
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        isForSale: product.isForSale,
        timestamp: product.timestamp,
        category: product.category,
        farmer: {
          id: product.farmer ? product.farmer._id : null,
          name: product.farmer && product.farmer.basicDetails && product.farmer.basicDetails.profile
            ? product.farmer.basicDetails.profile.name 
            : 'Unknown'
        }
      }
    }));

    res.json({ originalQuery: searchQuery, recommendedProducts: formattedResults });

  } catch (error) {
    console.error('Error in getRecommendedProductsWithSearch:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check AI initialization status
exports.checkAIStatus = (req, res) => {
  if (isAIInitialized) {
    res.json({ status: 'OK', message: 'Google Generative AI is initialized' });
  } else {
    res.status(500).json({ status: 'Error', message: 'Google Generative AI is not initialized' });
  }
};

// Fetch details of a specific product
exports.getSpecificProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description price unit smallestSellingUnit category isForSale timestamp reviews totalRating farmer')
      .populate('farmer', 'basicDetails.profile.name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const response = {
      name: product.name,
      description: product.description,
      farmer: product.farmer ? {
        id: product.farmer._id,
        name: product.farmer.basicDetails?.profile?.name || 'Unknown'
      } : null,
      reviews: product.reviews,
      totalRating: product.totalRating,
      price: product.price,
      unit: product.unit,
      category: product.category,
      smallestSellingUnit: product.smallestSellingUnit,
      isForSale: product.isForSale,
      timestamp: product.timestamp
    };

    res.json(response);
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const products = await Product.find({ category: req.params.category, isForSale: true })
      .populate('farmer', 'basicDetails.profile.name')
      .select('name description price category isForSale timestamp farmer')
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Product.countDocuments({ category: req.params.category, isForSale: true });

    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      isForSale: product.isForSale,
      timestamp: product.timestamp,
      category: product.category,
      farmer: product.farmer ? {
        id: product.farmer._id,
        name: product.farmer.basicDetails?.profile?.name || 'Unknown'
      } : null
    }));

    res.json({
      products: formattedProducts,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    });
  } catch (error) {
    console.error('Error during fetching products by category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductsByFarmer = async (req, res) => {
    const farmerId = req.params.farmerId;

    try {
        // Find products by the farmer's ID
        const products = await Product.find({ farmer: farmerId });

        // Check if any products were found
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this farmer.' });
        }

        // Respond with the found products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by farmer:', error);
        res.status(500).json({ message: 'Server error while retrieving products.' });
    }
};
exports.searchProducts = async (req, res) => {
  console.log('Incoming request for search');
  try {
    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    console.log('Search Query:', searchQuery);
    console.log('Limit:', limit);

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(searchQuery, 'i');

    const products = await Product.find({
      isForSale: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    })
    .populate('farmer', 'basicDetails.profile.name')
    .select('name description price isForSale category timestamp farmer')
    .limit(limit)
    .lean();

    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      isForSale: product.isForSale,
      timestamp: product.timestamp,
      category: product.category,
      farmer: product.farmer ? {
        id: product.farmer._id,
        name: product.farmer.basicDetails?.profile?.name || 'Unknown'
      } : null
    }));

    res.json({
      products: formattedProducts,
      totalCount: formattedProducts.length
    });

  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductsByTimestamp = async (req, res) => {
  console.log('Incoming request for products by timestamp');
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find the products with the specified criteria
    const products = await Product.find({ isForSale: true, unit: { $gt: 0 } })
      .sort({ timestamp: -1 }) // Sort by newest first
      .populate({
        path: 'farmer',
        select: 'basicDetails.profile.name' // Populate only farmer's name
      })
      .select('name description price category isForSale timestamp farmer') // Select only the required fields
      .skip(skip)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects for faster access

    console.log('Products after population:', products);

    // Get the total number of products that match the criteria
    const totalCount = await Product.countDocuments({ isForSale: true, unit: { $gt: 0 } });

    // Format the response to include only required fields
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      isForSale: product.isForSale,
      timestamp: product.timestamp,
      category: product.category,
      farmer: product.farmer ? {
        id: product.farmer._id,
        name: product.farmer.basicDetails?.profile?.name || 'Unknown'
      } : null
    }));

    // Send the response with the formatted products and pagination details
    res.json({
      products: formattedProducts,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      limit
    });
  } catch (error) {
    console.error('Error fetching products by timestamp:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message || error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.addProduct = async (req, res) => {
  const imageUrls = req.body.imageUrls || [];
  try {
    const { name, description, price, unit, smallestSellingUnit, category, isForSale } = req.body;
    const farmerId = req.user.userId;

    const product = new Product({
      farmer: farmerId,
      name,
      description,
      price,
      unit,
      smallestSellingUnit,
      category,
      isForSale,
      images: imageUrls
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    // If there's an error, delete the uploaded images
    if (imageUrls.length > 0) {
      await deleteFiles(imageUrls);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const allowedUpdates = ['name', 'description', 'price', 'unit', 'smallestSellingUnit', 'isForSale', 'category', 'images'];
    
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const product = await Product.findOne({ _id: productId, farmer: req.user.userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission to update it' });
    }

    Object.keys(updates).forEach(update => product[update] = updates[update]);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
