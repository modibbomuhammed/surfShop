const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware');
const { 
	getPosts, 
	newPost, 
	createPost,
	showPost,
	editPost,
	updatePost,
	postDelete
} = require('../controllers/posts');


/* GET post index  /post. */
router.get('/', asyncErrorHandler(getPosts));

// Get /new
router.get('/new', newPost);

// post create /posts
router.post('/', asyncErrorHandler(createPost));

// get show /posts/:id
router.get('/:id', asyncErrorHandler(showPost));

// edit /posts/:id/edit GET
router.get('/:id/edit', asyncErrorHandler(editPost));

// Update /posts/:id Update
router.put('/:id', asyncErrorHandler(updatePost));

// Delete /posts/:id delete
router.delete('/:id', asyncErrorHandler(postDelete));


module.exports = router;
