function isAdmin(req, res, next) {
  console.log('Cookies:', req.cookies);
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}

function isEmployee(req, res, next) {
  console.log('Cookies:', req.cookies);
  if (req.isAuthenticated() && (req.user.role === 'employee' || req.user.role === 'admin')) {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

module.exports = {
  isAdmin,
  isEmployee,
  isAuthenticated
};