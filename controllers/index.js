const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const util = require('util');
const { deleteProfileImage } = require('../middleware');
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
let mapBoxToken = process.env.MAPBOX_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


module.exports = {
	
	async landingPage(req,res,next){
		const posts = await Post.find({}).sort('-_id').exec();
		const recentPosts = posts.slice(0, 3)
		res.render('index', { posts, recentPosts, mapBoxToken, title: 'SurfShop - Home Page'})
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
	
	getForgotPw(req,res,next){
		res.render('users/forgot')
	},
	
	async putForgotPw(req,res,next){
		const token = await crypto.randomBytes(20).toString('hex');
		
		let user = await User.findOne({ email: req.body.email })
		if(!user){
			req.session.error = 'No account exists with that email'
			return res.redirect('/forgot-password');
		}
		user.resetPasswordToken = token
		user.resetPasswordExpires = Date.now() + 3600000
		await user.save()
		
		const msg = {
		  to: req.body.email,
		  from: 'Surf Shop Admin <modibbomuhammed@gmail.com>',
		  subject: 'Surf Shop - Forgot Password / Reset',
		  text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, ''),
		  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		};
		
		await sgMail.send(msg);
		
		req.session.success = `An email has been sent to ${req.body.email} with further instructions`
		res.redirect('/forgot-password');
	},
	
	async getReset(req,res,next){
		
		const { token } = req.params
		const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
		if(!user){
			req.session.error = 'Password reset token is invalid or has expired.';
		return res.redirect('/forgot-password');
		}
		res.render('users/reset', { token });
	},
	
	async putReset(req,res,next){
		const { token } = req.params
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gte: Date.now() }
		})
		
		if(!user){
			req.session.error = 'Password reset token is invalid or has expired.';
    		return res.redirect('/forgot-password');
		}
		if(req.body.password === req.body.confirm){
			await user.setPassword(req.body.password)
			user.resetPasswordExpires = null
			user.resetPasswordToken = null
			await user.save()
			const login = util.promisify(req.login.bind(req))
			await login(user);
		} else {
			req.session.error = 'Passwords do not match.';
			return res.redirect(`/reset/${ token }`);
		}
		
		const msg = {
		to: user.email,
		from: 'Surf Shop Admin <modibbomuhammed@gmail.com>',
		subject: 'Surf Shop - Password Changed',
		text: `Hello,
			This email is to confirm that the password for your account has just been changed.
			If you did not make this change, please hit reply and notify us at once.`.replace(/			/g, '')
		};

		await sgMail.send(msg);

		req.session.success = 'Password successfully updated!';
		res.redirect('/');

	},			
}