const User = require('../models/user');



module.exports = {
	 async postRegister (req,res,next){
		let newUser = new User({
			username: req.body.username,
			email: req.body.email,
			image: req.body.image,
		})
			let newguy = await User.register(newUser, req.body.password);
			console.log(newguy);
			res.redirect('/')
	}
}