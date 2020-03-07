const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');


// configure multer
const storage = multer.diskStorage({
	filename: (req,file,cb) => {
		cb(null, `${file.fieldname} - ${Date.now()}`)	
	},
	
})
const upload = multer({
	storage,
	fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).array('images', 4)


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
router.post('/', upload , asyncErrorHandler(createPost));

// get show /posts/:id
router.get('/:id', asyncErrorHandler(showPost));

// edit /posts/:id/edit GET
router.get('/:id/edit', asyncErrorHandler(editPost));

// Update /posts/:id Update
router.put('/:id', asyncErrorHandler(updatePost));

// Delete /posts/:id delete
router.delete('/:id', asyncErrorHandler(postDelete));


module.exports = router;
