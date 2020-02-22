const express = require('express');
const router = express.Router();

/* GET post index  /post. */
router.get('/', (req, res, next) => {
  res.send('/posts')
});

// Get /new
router.get('/new', (req, res, next) => {
  res.send('/posts/new')
});

// post create /posts
router.post('/', (req, res, next) => {
  res.send('CEATE POST')
});

// get show /posts/:id
router.get('/:id', (req, res, next) => {
  res.send('SHOW PAGE')
});

// edit /posts/:id/edit GET
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT')
});

// Update /posts/:id Update
router.put('/:id', (req, res, next) => {
  res.send('UPDATE')
});

// Delete /posts/:id delete
router.get('/:id', (req, res, next) => {
  res.send('DELETE')
});


module.exports = router;
