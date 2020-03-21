const express = require('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage }).array('image',4); // adding this to utilise multer-cloudinary storage

// configure multer
// const storage = multer.diskStorage({
// 	filename: (req,file,cb) => {
// 		cb(null, `${file.fieldname} - ${Date.now()}`)	
// 	},
	
// })
// const upload = multer({
// 	storage,
// 	fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//             return callback(new Error('Only images are allowed'))
//         }
//         callback(null, true)
//     }
// }).array('image', 4)


const { asyncErrorHandler, isLoggedIn, isAuthor, searchAndFilterPosts } = require('../middleware');
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
router.get('/', asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(getPosts));

// Get /new
router.get('/new', isLoggedIn, newPost);

// post create /posts
router.post('/', isLoggedIn, upload, asyncErrorHandler(createPost));

// get show /posts/:id
router.get('/:id', asyncErrorHandler(showPost));

// edit /posts/:id/edit GET
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), editPost);

// Update /posts/:id Update
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload, asyncErrorHandler(updatePost));

// Delete /posts/:id delete
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDelete));


module.exports = router;
