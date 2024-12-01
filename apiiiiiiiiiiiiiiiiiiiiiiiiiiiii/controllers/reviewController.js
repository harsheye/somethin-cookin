const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');


const updateTotalRating = async (productId) => {
  try {
      // Find the product by ID and populate the reviews
      const product = await Product.findById(productId).populate('reviews.user');

      if (!product) {
          throw new Error('Product not found');
      }

      // Calculate total rating and the number of reviews
      const totalReviews = product.reviews.length;
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);

      // Calculate average rating
      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      // Update the product's totalRating field
      product.totalRating = averageRating;

      // Save the updated product
      await product.save();
  } catch (error) {
      console.error("Error updating total rating:", error);
      throw error; // Rethrow the error for handling in the calling function
  }
};

exports.addReview = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.user.userId;

        // Validate inputs
        if (!productId || !rating) {
            return res.status(400).json({ message: 'Product ID and rating are required' });
        }

        // Convert productId to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Find the product and user
        const product = await Product.findById(productObjectId).populate('reviews.user');
        const user = await User.findById(userId).select('productsToBeReviewed reviews');

        if (!product || !user) {
            return res.status(400).json({ message: 'Invalid product or user' });
        }
        // check if the user has already reviewed this product
        // Find the user
      
      console.log("User fetched:", user);

      if (!user) {
          console.log("User not found: Invalid user ID");
          return res.status(400).json({ message: 'Invalid user' });
      }

      // Log productsToBeReviewed for debugging
      console.log("User's Products To Be Reviewed:", user.productsToBeReviewed);

      // Check if the user has a product to review (isReviewed is false)
      const userOrderWithProduct = user.productsToBeReviewed.find(item => 
          item.product.toString() === productId && !item.isReviewed
      );

      console.log("User Order with Product:", userOrderWithProduct);

      if (!userOrderWithProduct) {
          console.log("Review denied: You can only review products you have ordered and have not reviewed yet");
          return res.status(400).json({ message: 'You can only review products you have ordered and have not reviewed yet' });
      }

        // Check if the user has already reviewed this product
        const existingReview = product.reviews.find(r => r.user.equals(userId));
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Create the review object
        const newReview = new mongoose.Types.ObjectId(); // Create a new ObjectId for the review
        const reviewData = {
            _id: newReview, // Use the newly created ObjectId
            user: userId,
            rating,
            review: review || '',
            images: req.body.imageUrls || [],
            videoLink: req.body.videoUrl || ''
        };

        // Push the new review to the product's reviews array
        product.reviews.push(reviewData);
        
        // Save the updated product
        await product.save();

        //  Update productsToBeReviewed to set isReviewed to true
      const updateResult = await User.updateOne(
          { _id: userId, 'productsToBeReviewed.product': productId },
          { $set: { 'productsToBeReviewed.$.isReviewed': true } }
      );

      console.log("Products To Be Reviewed updated:", updateResult);

        // Add the review ObjectId to the user's reviews array
        user.reviews.push(newReview);
        await user.save();

        // Optionally, update total rating (make sure this function is defined)
        await updateTotalRating(productId);

        res.status(201).json({ message: 'Review added successfully', review: reviewData });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};



// exports.addReview = async (req, res) => {
//   try {
//       const { productId, rating, review, images, videoLink } = req.body;
//       const userId = req.user.userId;

//       // Log input data
//       console.log("Request Body:", req.body);
//       console.log("User ID from token:", userId);

//       // Validate inputs
//       if (!productId || !rating) {
//           console.log("Validation failed: Product ID and rating are required");
//           return res.status(400).json({ message: 'Product ID and rating are required' });
//       }

//       if (rating < 1 || rating > 5) {
//           console.log("Validation failed: Rating must be between 1 and 5");
//           return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//       }

//       // Find the user
//       const user = await User.findById(userId).select('productsToBeReviewed reviews').lean();
//       console.log("User fetched:", user);

//       if (!user) {
//           console.log("User not found: Invalid user ID");
//           return res.status(400).json({ message: 'Invalid user' });
//       }

//       // Log productsToBeReviewed for debugging
//       console.log("User's Products To Be Reviewed:", user.productsToBeReviewed);

//       // Check if the user has a product to review (isReviewed is false)
//       const userOrderWithProduct = user.productsToBeReviewed.find(item => 
//           item.product.toString() === productId && !item.isReviewed
//       );

//       console.log("User Order with Product:", userOrderWithProduct);

//       if (!userOrderWithProduct) {
//           console.log("Review denied: You can only review products you have ordered and have not reviewed yet");
//           return res.status(400).json({ message: 'You can only review products you have ordered and have not reviewed yet' });
//       }

//       // Check if the product has already been reviewed
//       const product = await Product.findById(productId).select('reviews').lean();
//       console.log("Product fetched:", product);

//       const existingReview = product.reviews.find(r => r.user.toString() === userId);
//       console.log("Existing Review:", existingReview);

//       if (existingReview) {
//           console.log("Review denied: You have already reviewed this product");
//           return res.status(400).json({ message: 'You have already reviewed this product' });
//       }

//       // Create the review object
//       const newReview = {
//           user: userId,
//           rating,
//           review: review || '',
//           images: images || [],
//           videoLink: videoLink || ''
//       };

//       console.log("New Review to be added:", newReview);

//       // Add review to the product
//       await Product.findByIdAndUpdate(productId, {
//           $push: { reviews: newReview }
//       });

//       console.log("Review added to product");

//       // Add the review ID to the user's reviews array
//       await User.findByIdAndUpdate(userId, {
//           $push: { reviews: newReview._id }
//       });

//       console.log("Review ID added to user reviews");

//       // Update productsToBeReviewed to set isReviewed to true
//       const updateResult = await User.updateOne(
//           { _id: userId, 'productsToBeReviewed.product': productId },
//           { $set: { 'productsToBeReviewed.$.isReviewed': true } }
//       );

//       console.log("Products To Be Reviewed updated:", updateResult);

//       // Update total rating (helper function to update the product's rating based on all reviews)
//       await updateProductRating(productId);
//       console.log("Product rating updated");

//       res.status(201).json({ message: 'Review added successfully', review: newReview });
//   } catch (error) {
//       console.error("Error adding review:", error);
//       res.status(500).json({ message: 'Error adding review', error: error.message });
//   }
// };




// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('reviews.user', 'basicDetails.profile.name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ reviews: product.reviews, totalRating: product.totalRating });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, review, images, videoLink } = req.body;
    const userId = req.user.userId;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviewIndex = product.reviews.findIndex(r => r.user.toString() === userId);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the review
    product.reviews[reviewIndex] = {
      ...product.reviews[reviewIndex],
      rating,
      review: review || product.reviews[reviewIndex].review, // Update only if provided
      images: images || product.reviews[reviewIndex].images,
      videoLink: videoLink || product.reviews[reviewIndex].videoLink,
      updatedAt: Date.now()
    };

    await product.save();
    await updateProductRating(productId);

    res.status(200).json({ message: 'Review updated successfully', review: product.reviews[reviewIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the review by the user
    const reviewIndex = product.reviews.findIndex(r => r.user.toString() === userId);
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Remove the review from the product's reviews array
    const removedReview = product.reviews.splice(reviewIndex, 1);
    await product.save();

    // Update the product's total rating
    await updateProductRating(productId);

    // Remove the review ObjectId from the user's reviews array
    await User.findByIdAndUpdate(userId, { $pull: { reviews: removedReview[0]._id } });

    // Set `isReviewed` to false in user's productsToBeReviewed array
    await User.findOneAndUpdate(
      { _id: userId, 'productsToBeReviewed.product': productId },
      { $set: { 'productsToBeReviewed.$.isReviewed': false } }
    );

    // Optionally, remove the product from the user's productsToBeReviewed array (if needed)
    // Uncomment this if you want to completely remove the product from `productsToBeReviewed`
    /*
    await User.findByIdAndUpdate(userId, {
      $pull: { productsToBeReviewed: { product: productId } }
    });
    */

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};


// Helper function to update product's total rating
async function updateProductRating(productId) {
  const product = await Product.findById(productId);
  if (!product) return;

  const totalRatings = product.reviews.length;
  if (totalRatings === 0) {
    product.totalRating = 0;
  } else {
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.totalRating = sum / totalRatings;
  }

  await product.save();
}

