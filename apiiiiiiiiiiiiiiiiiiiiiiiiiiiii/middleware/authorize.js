// middleware/authorize.js
function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.userRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.userRole)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
}

module.exports = authorize;
