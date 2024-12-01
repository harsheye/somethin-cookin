const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');

const router = express.Router();
const UPLOAD_DIR = '/home/ec2-user/uploads'; // Directory to store uploads

// Set up storage for different types of uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (req.params.uploadType === 'product') {
      uploadPath = path.join(UPLOAD_DIR, 'products', req.user.userId);
    } else if (req.params.uploadType === 'review') {
      uploadPath = path.join(UPLOAD_DIR, 'reviews', req.user.userId);
    } else if (req.params.uploadType === 'selfie') {
      uploadPath = path.join(UPLOAD_DIR, 'selfies');
    } else {
      return cb(new Error('Invalid upload type'));
    }
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer setup for filtering and file size limits
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

// Generic file upload route
router.post('/:uploadType', auth, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const fileUrls = req.files.map(file => `/uploads/${req.params.uploadType}/${req.user.userId}/${file.filename}`);
    res.json({
      message: 'Files uploaded successfully',
      fileUrls: fileUrls
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Specific route for farmer selfie upload
router.post('/farmer-selfie', auth, upload.single('selfie'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No selfie uploaded' });
    }
    const selfieUrl = `/uploads/selfies/${req.user.userId}/${req.file.filename}`;
    res.json({
      message: 'Farmer selfie uploaded successfully',
      selfieUrl: selfieUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading farmer selfie', error: error.message });
  }
});

// Function to delete files
const deleteFiles = async (fileUrls) => {
  for (const fileUrl of fileUrls) {
    const filePath = path.join(UPLOAD_DIR, fileUrl.replace('/uploads/', ''));
    try {
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
};

module.exports = {
  router,
  upload,
  deleteFiles
};
