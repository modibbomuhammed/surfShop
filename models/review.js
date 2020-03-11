const mongoose = require('mongoose');


let reviewSchema = new mongoose.Schema({
	body: String,
	ratings: Number,
	author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
	}
})


module.exports = mongoose.model('Review', reviewSchema)