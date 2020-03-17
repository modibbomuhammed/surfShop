const express = require('express');
const passport = require('passport');
const router = express.Router();
const { postRegister, postLogin, postLogout, landingPage, getRegister, getLogin, getProfile } = require('../controllers');
const { asyncErrorHandler, isLoggedIn  } = require('../middleware');

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

// GET /register
router.get('/register', getRegister);

// post /register
router.post('/register', asyncErrorHandler(postRegister));

// Get /login
router.get('/login', getLogin);

// post /login
router.post('/login', asyncErrorHandler(postLogin));

// Get /logout
router.get('/logout', postLogout);


// get /profile
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

// PUT /profile/:user_id
router.put('/profile/:user_id', (req, res, next) => {
  res.send('update user data');
});

// forgot password 
router.get('/forgot', (req, res, next) => {
  res.send('password forgot');
});

// Send user details for password update
router.put('/forgot', (req, res, next) => {
  res.send('password again');
});

// token for password reset
router.get('/reset/:token', (req, res, next) => {
  res.send('reset password with token');
});

// update password
router.put('/reset/:token', (req, res, next) => {
  res.send('update password');
});



module.exports = router;
