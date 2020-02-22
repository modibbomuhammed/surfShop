const User = require('../models/user');



module.exports = {
	 postRegister (req,res,next){
		let newUser = new User({
			username: req.body.username,
			email: req.body.email,
			image: req.body.image,
		})
		User.register(newUser, req.body.password, (err,user) => {
		if (err) {
			  console.log('error while user register!', err);
			  return next(err);
		}
		console.log(user);
		console.log('user registered!');

		res.redirect('/');
		});
	}
}