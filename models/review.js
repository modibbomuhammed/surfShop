const mongoose = require('mongoose');


let reviewSchema = new mongoose.Schema({
	body: String,
	author: {
		id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
		},
		username: String
	}
})


module.exports = mongoose.model('Review', reviewSchema)