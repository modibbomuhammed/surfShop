// require('dotenv').config();
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;

// cloudinary config
cloudinary.config({ 
  cloud_name: 'modibbomuhammed', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



module.exports = {
	async getPosts(req,res,next){
		let posts = await Post.find({})
		res.render('posts/index', { posts })
	},
	
	newPost(req,res,next){
		res.render('posts/new');
	},
	
	async createPost(req,res,next){
		req.body.image = []
		for(let file of req.files){
			let result = await cloudinary.uploader.upload(file.path)
			req.body.image.push({
				url: result.secure_url,
				public_id: result.public_id
			})	
		}
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
		
		let foundPost = await Post.findById(req.params.id);
		let images = []
		for(let x of foundPost.image){
			images.push(x.public_id)
		}
		
		await cloudinary.api.delete_resources(images);
		req.body.image = []
		for(let file of req.files){
			let result = await cloudinary.uploader.upload(file.path)
			req.body.image.push({
				url: result.secure_url,
				public_id: result.public_id
			}) 
		}
		let updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.redirect(`/posts/${updatePost.id}`)
		
		// 	what it use to be	
		// let update = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
		// res.redirect(`/posts/${update.id}`);
	},
	
	async postDelete(req,res,next){
		await Post.findByIdAndDelete(req.params.id);
		res.redirect('/posts');
	}
}