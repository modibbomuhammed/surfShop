const express = require('express');
const router = express.Router({ mergeParams: true});

/* GET review index  /posts/:id/reviews. */
router.get('/', (req, res, next) => {
  res.send('/reviews')
});

// // Get /posts/:id/reviews/new
// router.get('/new', (req, res, next) => {
//   res.send('/reviews/new')
// }); //we dont need this

// review create /posts/:id/reviews
router.post('/', (req, res, next) => {
  res.send('CEATE review')
});

// get show /posts/:id/reviews/:review_id
router.get('/:review_id', (req, res, next) => {
  res.send('SHOW PAGE Reviews')
});

// edit /posts/:id/reviews/:review_id/edit GET
router.get('/:review_id/edit', (req, res, next) => {
  res.send('EDIT reviews')
});

// Update /posts/:id/reviews/:review_id Update
router.put('/:review_id', (req, res, next) => {
  res.send('UPDATE reviews')
});

// Delete /posts/:id/reviews/:review_id delete
router.get('/:review_id', (req, res, next) => {
  res.send('DELETE reviews')
});


module.exports = router;
