const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
// const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoose = require('mongoose');

// require routes
const indexRouter 	= require('./routes/index');
const postRouter 		= require('./routes/posts');
const reviewRouter	= require('./routes/reviews');

const app = express();

// conect to mongodb
mongoose.connect('mongodb://localhost:27017/surfshopapp', { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('connected to the db'))
.catch((err)=> console.log(`failed to connnect due to ${err}`))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// session config
app.use(session({
  secret: 'Modash is in control',
  resave: false,
  saveUninitialized: true,
}))

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// mount routes
app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/posts/:id/reviews', reviewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
