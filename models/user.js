const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true}, 
	// password: String, 						added by default from passport local mongoose
	// username: {type: String, required: true, unique: true},
	image: String,
	// posts: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Post'
	// }],
	// reviews: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'Review'
	// }] no need for posts in use model, because we can use the author to query the posts  of that particular author
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)