function isAdmin(req, res, next) {
    console.log('Cookies:', req.cookies);
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Access denied' });
  }
  
  module.exports = {
    isAdmin
  };
  