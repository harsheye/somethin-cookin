// middleware/authorize.js
function authorize(...roles) {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Log user role and roles array
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", roles);

    // Flatten the roles array in case it's nested
    const flatRoles = roles.flat();

    // Check if any of the roles match the user's role (case insensitive comparison)
    const hasAccess = flatRoles.some(role => role.toLowerCase() === req.user.role.toLowerCase());

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next(); // Proceed to the next middleware/handler
  };
}

module.exports = authorize;
