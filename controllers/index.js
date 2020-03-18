const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const util = require('util');
const { deleteProfileImage } = require('../middleware');
const { cloudinary } = require('../cloudinary');	  						   
let mapBoxToken = process.env.MAPBOX_API_KEY

module.exports = {
	
	async landingPage(req,res,next){
		const posts = await Post.find({})
		res.render('index', { posts, mapBoxToken, title: 'SurfShop - Home Page'})
	},
	
	getRegister(req, res, next) {
		res.render('register', { title: 'Register', newUser: '' });
	},
	
	async postRegister (req,res,next){
		let newUser = new User({
			username: req.body.username,
			email: req.body.email,
		})
		if(req.file) newUser.image = { secure_url: req.file.secure_url, public_id: req.file.public_id}
		
		try{
			let newguy = await User.register(newUser, req.body.password);
			
			req.login(newguy, function(err){
				if(err){ return next(err)}
				req.session.success = `Welcome to Surf-Shop, ${newguy.username}`
				res.redirect('/')
			})
		}
		catch(err){
			deleteProfileImage(req)
			let error
			if(err.errmsg){
				if(err.errmsg.includes('duplicate') && err.errmsg.includes('index: email_1 dup key')){
				error = 'A user with the given email is already registered';
				}	
			} else { error = err.message }
			res.render('register', { title: 'Register', newUser, error })
		}
			
	},
	
	getLogin(req, res, next) {
		if (req.isAuthenticated()) return res.redirect('/');
		
		req.query.returnTo ?  req.session.redirectTo = req.headers.referer : '';
		res.render('login', { title: 'Login' });
	},
	
	async postLogin(req,res,next){
		// passport.authenticate('local', {
		// failureFlash: true,
		// failureRedirect: '/',
		// successFlash: true,
		// successRedirect: '/posts'
		// })(req,res,next);
		const { username, password } = req.body
		const { user, error } = await User.authenticate()(username, password)
		if(!user && error) return next(error);
		req.login(user, function(err){
			if(err) return next(err);
			req.session.success = `Welcome back, ${username}!`
			const redirectUrl = req.session.redirectTo || '/posts'
			delete req.session.redirectTo
			res.redirect(redirectUrl);
		})
	},
	
	postLogout(req,res,next){
		req.logout();
		req.session.success = 'You have successfully logged Out!! See You Again Soon'
		res.redirect('/')
	},
	
	async getProfile(req,res,next){
		let posts = await Post.find().where('author').equals(req.user._id).limit(50).exec()
		let user = await User.findById(req.user._id)
		res.render('profile', { posts, user })
	},
	
	async updateProfile(req,res,next){
		const { username, email } = req.body
		const { user } = res.locals
		if(username) user.username = username
		if(email) user.email = email
		
		if(req.file){
			if(user.image.public_id) await cloudinary.uploader.destroy(user.image.public_id)
			const { secure_url, public_id } = req.file
			user.image = { secure_url, public_id}
		}
		
		await user.save()
		const login = util.promisify(req.login.bind(req));
		await login(user)
		req.session.success = 'Profile successfully updated!';
		res.redirect('/profile');
	},
	
	getForgotPw(res,req,next){
		
	},
	
	async putForgotPw(req,res,next){
		
	},
	
	async getReset(req,res,next){
		
	},
	
	async putReset(req,res,next){
		
	}
	
}