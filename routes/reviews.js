const express = require('express');
const router = express.Router({ mergeParams: true});
const { createReview } = require('../controllers/reviews');
const { asyncErrorHandler } = require('../middleware');




router.post('/', asyncErrorHandler(createReview));

// Update /posts/:id/reviews/:review_id Update
router.put('/:review_id', (req, res, next) => {
  res.send('UPDATE reviews')
});

// Delete /posts/:id/reviews/:review_id delete
router.get('/:review_id', (req, res, next) => {
  res.send('DELETE reviews')
});


module.exports = router;
