// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      collection: decoded.collection
    };
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}

module.exports = auth;
