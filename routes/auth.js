const router = require('express').Router();
const passport = require('passport');
const authCheck = require('../middlewares/authCheck');

// @desc     Google Authentication
// @route    GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc     Google Callback
// @route    GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}`,
  })
);

// @desc    Logout User
// @route   GET /auth/logout
router.get('/logout', authCheck, (req, res) => {
  req.logout();
  return res.json({ success: true, msg: 'logout success' });
});

// @desc    Get authenticated user
// @route   GET /auth/user
router.get('/user', authCheck, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
