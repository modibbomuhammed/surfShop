const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');

const middleware = {
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
	},
	
	isValidPassword: async (req,res,next) => {
		let username = req.params.userid
		let foundUser = await User.findById(username)
		const { user }  = await User.authenticate()(foundUser.username, req.body.currentPassword)
		if(user){
			res.locals.user = user;
			next();
		} else {
			middleware.deleteProfileImage(req)
			req.session.error = 'Incorrect Current Password';
			return res.redirect('back')
		}
	},
	
	changePassword: async (req,res,next) => {
		const { newPassword, passwordConfirmation } = req.body
		const { user } = res.locals
		
		if(newPassword && !passwordConfirmation){
			middleware.deleteProfileImage(req)
			req.session.error = 'Missing Password Confirmation!!'
			return res.redirect('/profile')
		} else if(newPassword && passwordConfirmation){
			if(newPassword === passwordConfirmation){
				await user.setPassword(newPassword);  
				next();	
			} else {
				middleware.deleteProfileImage(req)
				req.session.error = 'New Passwords Must Match'
				return res.redirect('/profile')	
			}
		} else {
			next()
		}
	},
	async deleteProfileImage(req){
		if(req.file) await cloudinary.uploader.destroy(req.file.public_id)
	}
};


module.exports = middleware;
