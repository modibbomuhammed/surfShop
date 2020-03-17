const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post')

module.exports = {
	asyncErrorHandler: (fn) => 
		(req,res,next) => {
			Promise.resolve(fn(req,res,next))
				   .catch(next);
		
	},
	
	isReviewAuthor: async (req,res,next) => {
		let review = await Review.findById(req.params.review_id)
		if(review.author.equals(req.user._id)){
			return next();
		} 
		req.session.error = "Sorry Only the owner can edit this review";
		return res.redirect('/')
	},
	
	isLoggedIn: (req,res,next) => {
		if(req.isAuthenticated()){
			next()
		} else {
			req.session.error = 'You need to be logged in to do that!';
			req.session.redirectTo = req.originalUrl
			res.redirect('/login')
		}
	},
	
	isAuthor: async (req,res,next) => {
		let post = await Post.findById(req.params.id);
		if(req.user._id.equals(post.author)){
			res.locals.foundPost = post
			return next()
		}
		req.session.error = "You don't have permission to do that!!"
		res.redirect('back')
	}
}



