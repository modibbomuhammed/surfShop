const mongoose = require('mongoose');
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

let postSchema = new mongoose.Schema({
	title: String,
	price: String, 	
	description: String,
	image: [{url: String, public_id: String}],
	location: String,
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	properties: {
		description: String
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	reviews:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Review"
	}],
	avgRating: { type: Number, default: 0 }
})

// delete any reviews associated with the post for delete
postSchema.pre('remove', async function(){
	await Review.remove({
		_id: {
			$in: this.reviews
		}
	})
})

postSchema.methods.calculateAvgRating = function(){
	let totalratings = 0
	if(this.reviews.length){
		this.reviews.forEach(function(review, i){
		totalratings += review.ratings
		})

		this.avgRating = Math.round((totalratings/ this.reviews.length) * 10) / 10
	} else {
		this.avgRating = totalratings
	}
	const floorRating = Math.floor(this.avgRating)
	this.save();
	return floorRating
}


postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema)

