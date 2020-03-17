const express = require('express');
const router = express.Router({ mergeParams: true});
const { createReview, updateReview, deleteReview } = require('../controllers/reviews');
const { asyncErrorHandler, isReviewAuthor, isLoggedIn } = require('../middleware');



router.post('/', isLoggedIn, asyncErrorHandler(createReview));

// Update /posts/:id/reviews/:review_id Update
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(updateReview));

// Delete /posts/:id/reviews/:review_id delete
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(deleteReview));


module.exports = router;
