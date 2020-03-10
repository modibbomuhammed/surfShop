const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
	
	async createReview(req,res,next){
		let post = await Post.findById(req.params.id)
		// req.body.author = {
		// 	id: 123456,
		// 	username: 'req.user.username'
		// }
		
		let reviews = await Review.create(req.body) 
			post.reviews.push(reviews);
		
		await post.save()
	req.session.success = 'Review created succesfully'		
		res.redirect('/posts/' + post.id)
	},
	
	
	
	async updateReview(req,res,next){
		let post = await Post.findById(req.params.id)
		for(let review of post.reviews){
			if(review.id === req.params.review_id){
				await Review.findByIdAndUpdate(req.params.id, req.body);
			}
		}
	},
	
	async reviewDelete(req,res,next){
		
	}
}