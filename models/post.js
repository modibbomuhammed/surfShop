const mongoose = require('mongoose');
const Review = require('./review');

let postSchema = new mongoose.Schema({
	title: String,
	price: String, 	
	description: String,
	image: [{url: String, public_id: String}],
	location: String,
	coordinates: Array,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Review"
	}]
})

// delete any reviews associated with the post for delete
postSchema.pre('remove', async function(){
	await Review.remove({
		_id: {
			$in: this.reviews
		}
	})
})

module.exports = mongoose.model('Post', postSchema)

