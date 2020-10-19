module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ success: false, error: 'Access Denied' });
  }
};
