const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
	
	async createReview(req,res,next){
		let post = await Post.findById(req.params.id).populate('reviews').exec()
		for(let review of post.reviews){
			if(review.author.equals(req.user._id) ){
				req.session.error = "You have already created a review for this"
				return res.redirect('back')
			}
		}
// 		he used a filter in his code
		// let hasReviewed = post.reviews.filter(review => review.author.equals(req.user._id)).length
		
		req.body.author = req.user._id
		let reviews = await Review.create(req.body) 
			post.reviews.push(reviews);
		
		await post.save()
		req.session.success = 'Review created succesfully'		
		res.redirect('/posts/' + post.id)
	},
	
	
	
	async updateReview(req,res,next){
		await Review.findByIdAndUpdate(req.params.review_id, req.body);
		req.session.success = "Review Updated Successfully!!"
		res.redirect('/posts/' + req.params.id)
	},
	
	async deleteReview(req,res,next){
		let post = await Post.findByIdAndUpdate(req.params.id, {
			$pull: { reviews: req.params.review_id }
		});
		await Review.findByIdAndRemove(req.params.review_id)
		req.session.success = "Review SuccessFully Deleted!!"
		res.redirect(`/posts/${req.params.id}`)
	}
}