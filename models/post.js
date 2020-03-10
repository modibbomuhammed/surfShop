const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
	title: String,
	price: String, 	
	description: String,
	image: [{url: String, public_id: String}],
	posts: String,
	location: String,
	coordinates: Array,
	author: {
		
		id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
		},
		
		username: String
	},
	
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Review"
	}]
})


module.exports = mongoose.model('Post', postSchema)

