const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require("express-fileupload")
const dotenv = require('dotenv');

const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));

// static files (games)
app.use("/games", express.static(path.join(__dirname, 'games')));

// router for admin (/admin)
app.use('/admin', adminRouter);

// router for api (/api/v1)
app.use('/api/v1', apiRouter);

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

  // if 404
  if (err.status === 404) {
    return res.json({
      "status": "not-found",
      "message": "Not found"
    })
  }

  // if else
  res.render('error');
});

module.exports = app;
