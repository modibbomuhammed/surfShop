const User = require('../models/user');
const passport = require('passport');


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
	},
	
	postLogin(req,res,next){
		passport.authenticate('local', {
		// failureFlash: true,
		failureRedirect: '/',
		// successFlash: true,
		successRedirect: '/login'
		})(req,res,next);	
	},
	
	postLogout(req,res,next){
		req.logout();
		res.send('logout route')
	}
	
	
}