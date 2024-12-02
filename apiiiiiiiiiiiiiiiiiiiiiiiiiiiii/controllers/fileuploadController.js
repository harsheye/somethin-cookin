const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Farmer = require('../models/Farmer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'selfies');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'selfie-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Export the upload middleware and handler separately
exports.uploadSelfie = upload.single('selfie');

exports.handleSelfieUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const selfieUrl = `/uploads/selfies/${req.file.filename}`;
    
    if (req.user.collection === 'farmers') {
      await Farmer.findByIdAndUpdate(req.user.userId, {
        'basicDetails.profile.selfie': selfieUrl
      });
    }

    res.json({ url: selfieUrl });
  } catch (error) {
    console.error('Error handling selfie upload:', error);
    res.status(500).json({ error: 'Failed to process selfie upload' });
  }
};
