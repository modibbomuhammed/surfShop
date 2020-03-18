const fetch = require('node-fetch');
const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_API_KEY
const baseClient = ({ accessToken: mapBoxToken})

const geocoder = mbxGeocoding(baseClient)
const { cloudinary } = require('../cloudinary');

module.exports = {
	async getPosts(req,res,next){
		let posts = await Post.paginate({}, {
			page: req.query.page || 1,
			limit: 10,
			sort: { '_id': -1} // '-_id'
		})
		posts.page = Number(posts.page)
		// let posts = await Post.find({})
		res.render('posts/index', { posts, mapBoxToken })
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
					// console.log(match.features[0].center, 'from the createpost controller')
					 req.body.geometry = match.features[0].geometry
					req.body.author = req.user._id
	
		req.body.image = []
		for(let file of req.files){
			// let result = await cloudinary.uploader.upload(file.path)
			req.body.image.push({
				url: file.secure_url,
				public_id: file.public_id
			})	
		}
		
		 // let newPost = await Post.create(req.body);
		let post = new Post(req.body);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
		
		req.session.success = 'You have succesfully created a post';
		 res.redirect(`/posts/${post._id}`)
	},
	
	async showPost(req,res,next){
		let post = await Post.findById(req.params.id).populate({
			path: 'reviews',
			options: { sort: { '_id': -1} },
			populate: {
				path: 'author',
				model: 'User'
			}
		}).populate('author')
		
		let floorRating = post.calculateAvgRating()
		res.render('posts/show', { post, floorRating, mapBoxToken });
	},
	
	editPost(req,res,next){
		res.render('posts/edit');
	},
	
	async updatePost(req,res,next){
		
		let foundPost = res.locals.foundPost;
		
		if(req.body.location !== foundPost.location){
			let response = await geocoder.forwardGeocode({
					  			query: req.body.location,
			  					limit: 1
								})
			  					.send()
			const match = response.body
			foundPost.geometry = match.features[0].geometry
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
				// let result = await cloudinary.uploader.upload(file.path)
				foundPost.image.push({
					url: file.secure_url,
					public_id: file.public_id
				}) 
			}
			
		}
		
		let {title, description, price } = req.body
		foundPost.title = title
		foundPost.description = description
		foundPost.price = price
		foundPost.properties.description = `<strong><a href="/posts/${foundPost._id}">${foundPost.title}</a></strong><p>${foundPost.location}</p><p>${foundPost.description.substring(0, 20)}...</p>`;
		
		
		let updatedPost = await foundPost.save({new:true})
			
		res.redirect(`/posts/${updatedPost.id}`)
		// 	what it use to be	
		// let update = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
		// res.redirect(`/posts/${update.id}`);
	},
	
	async postDelete(req,res,next){
		// let post = await Post.findById(req.params.id)
		let post = res.locals.foundPost
		
		for(let image of post.image){
			await cloudinary.uploader.destroy(image.public_id)
		}
		await post.remove();
		// await Post.findByIdAndDelete(req.params.id);
		req.session.success = 'Post was successfully deleted!!'
		res.redirect('/posts');
	}
}