// require('dotenv').config();
const fetch = require('node-fetch');
const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const baseClient = ({ accessToken: process.env.MAPBOX_API_KEY})

const geocoder = mbxGeocoding(baseClient)


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
	
		// method using node-fetch with mapbox
// 	let response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.location}.json?access_token=pk.eyJ1IjoibW9kaWJib211aGFtbWVkIiwiYSI6ImNrN2o4bW1rajA5cnEzZXJ3Z2tjcHh0eG4ifQ.HhXWW8u_prQskpDfMM_43g`
// )
// 	let result = await response.json()
// 	console.log(result.features[0].geometry.coordinates)
		
// 			req.body.lat = result.features[0].geometry.coordinates[0];
// 			req.body.lng = result.features[0].geometry.coordinates[1];
		

				let response = await geocoder.forwardGeocode({
									query: req.body.location,
									limit: 1
									})
									.send()
					const match = response.body
					console.log(match.features[0].center)
					 req.body.coordinates = match.features[0].geometry.coordinates

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
		
		if(req.body.location !== foundPost.location){
			let response = await geocoder.forwardGeocode({
					  			query: req.body.location,
			  					limit: 1
								})
			  					.send()
			const match = response.body
			foundPost.coordinates = match.features[0].center
			foundPost.location = req.body.location
		} 
		
		if(req.body.pictures && req.body.pictures.length){
			let images = []
			for(let image of req.body.pictures){
				images.push(image)
				for(let img of foundPost.image){
					if(img.public_id === image){
						let index = foundPost.image.indexOf(img);
						foundPost.image.splice(index, 1)
					}				
				}
			}
			await cloudinary.api.delete_resources(images);
			
		}
		
		if(req.files){
			for(let file of req.files){
				let result = await cloudinary.uploader.upload(file.path)
				foundPost.image.push({
					url: result.secure_url,
					public_id: result.public_id
				}) 
			}
			
		}
		
		let {title, description, price } = req.body
		foundPost.title = title
		foundPost.description = description
		foundPost.price = price
		
		let updatedPost = await foundPost.save({new:true})
			
		res.redirect(`/posts/${updatedPost.id}`)
		// 	what it use to be	
		// let update = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
		// res.redirect(`/posts/${update.id}`);
	},
	
	async postDelete(req,res,next){
		let post = await Post.findById(req.params.id)
		for(let image of post.image){
			await cloudinary.uploader.destroy(image.public_id)
		}
		await post.remove();
		// await Post.findByIdAndDelete(req.params.id);
		res.redirect('/posts');
	}
}