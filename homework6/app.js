/**
 * Require modules
 */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

/**
 * Require Routes
 */
const index = require('./routes/index');
const order = require('./routes/order');

/**
 * APP setup
 */
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * App include parsers, logger, etc
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.use('/', index);
app.use('/order/', order);

/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
