var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SurfShop - Home Page' });
});

// GET /register
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});

// post /register
router.post('/register', (req, res, next) => {
  res.send('/register post');
});

// Get /login
router.get('/login', (req, res, next) => {
  res.send('/login');
});

// post /login
router.post('/login', (req, res, next) => {
  res.sned('login post');
});

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
