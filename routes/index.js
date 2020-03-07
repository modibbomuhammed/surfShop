const express = require('express');
const passport = require('passport');
const router = express.Router();
const { postRegister, postLogin, postLogout } = require('../controllers');
const { asyncErrorHandler } = require('../middleware');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SurfShop - Home Page' });
});

// GET /register
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

// post /register
router.post('/register', asyncErrorHandler(postRegister));

// Get /login
router.get('/login', (req, res, next) => {
  res.send('/login');
});

// post /login
router.post('/login', postLogin);

// Get /logout
router.get('/logout', postLogout);


// get /profile
router.get('/profile', (req, res, next) => {
  res.send('profile');
});

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
