require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
// const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoose = require('mongoose');
const seeds = require('./seeds')

// seeds();

// require routes
const indexRouter 	= require('./routes/index');
const postRouter 		= require('./routes/posts');
const reviewRouter	= require('./routes/reviews');

const app = express();

// conect to mongodb
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=> console.log('connected to the db'))
.catch((err)=> console.log(`failed to connnect due to ${err}`))

// session config
app.use(session({
  secret: 'Modash is in control',
  resave: false,
  saveUninitialized: true,
}))



// set title variable
app.use(function(req,res,next){
	// req.user = {
	// 	 '_id' : "5e68f90edfffd840396c9360",
	// 'username' : 'ash',
	// }
	// req.user = {
	// 		"_id" : "5e68f922dfffd840396c9361",
	// "username" : "ash2",
	// }
	
	// req.user = {
	// 	  	"_id" : "5e6a35612f38912724d1bbad",
	// "username" : "ash3"
	// }
	// res.locals.currentUser = req.user;
	res.locals.title = 'Surf-Shop'
	res.locals.success = req.session.success || ''
	delete req.session.success
	res.locals.error = req.session.error || ''
	delete req.session.error
	next();
})


// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))


app.locals.moment = require('moment');


app.use(passport.initialize())
app.use(passport.session())
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user
	next()
})

// mount routes
app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/posts/:id/reviews', reviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
	
// 	my error handling
	console.log(err);
	req.session.error = err.message
	res.redirect('back');
});



module.exports = app;
