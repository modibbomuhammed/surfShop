const Post = require('../models/post');

module.exports = {
	async getPosts(req,res,next){
		let posts = await Post.find({})
		res.render('posts/index', { posts })
	},
	
	newPost(req,res,next){
		res.render('posts/new');
	},
	
	async createPost(req,res,next){
		let newPost = await Post.create(req.body);
		res.redirect(`/posts/${newPost._id}`)
	},
	
	async showPost(req,res,next){
		let post = await Post.findById(req.params.id)
		res.render('posts/show', { post });
	},
	
	async editPost(req,res,next){
		let foundPost = await Post.findById(req.params.id)
		res.render('posts/edit', { foundPost });
	},
	
	async updatePost(req,res,next){
		let update = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.redirect(`/posts/${update.id}`);
	},
	
	async postDelete(req,res,next){
		await Post.findByIdAndDelete(req.params.id);
		res.redirect('/posts');
	}
}