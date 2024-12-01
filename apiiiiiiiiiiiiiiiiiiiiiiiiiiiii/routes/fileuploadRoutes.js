const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Pass upload directory to the router
module.exports = function (UPLOAD_DIR) {
  
  // Set up storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
      if (req.route.path === '/product-images/:farmerId') {
        uploadPath = path.join(UPLOAD_DIR, 'farmers', req.params.farmerId, 'products', req.body.productId || 'temp');
      } else if (req.route.path === '/review-media/:userId') {
        uploadPath = path.join(UPLOAD_DIR, 'reviews', req.params.userId);
      } else if (req.route.path === '/farmer-selfie') {
        uploadPath = path.join(UPLOAD_DIR, 'farmers', 'selfies');
      }
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
  });

  // Routes for file uploads
  router.post('/product-images/:farmerId', upload.array('images', 5), (req, res) => {
    try {
      const imageUrls = req.files.map(file => file.path);
      res.json({ message: 'Product images uploaded successfully', imageUrls });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading product images', error: error.message });
    }
  });

  router.post('/review-media/:userId', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
  ]), (req, res) => {
    try {
      const imageUrls = req.files.images ? req.files.images.map(file => file.path) : [];
      const videoUrl = req.files.video ? req.files.video[0].path : null;
      res.json({ message: 'Review media uploaded successfully', imageUrls, videoUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading review media', error: error.message });
    }
  });

  router.post('/farmer-selfie', upload.single('selfie'), (req, res) => {
    try {
      res.json({ message: 'Farmer selfie uploaded successfully', selfieUrl: req.file.path });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading farmer selfie', error: error.message });
    }
  });

  return router;
};
