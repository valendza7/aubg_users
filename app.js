var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv-safe').config({
	path: __dirname + "/app-secret/.env",
	example: __dirname + "/.env_sample",
	allowEmptyValues: true
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
	res.commonsuccess = function (data) {
    res.status(200).json(data)
	}
	next();
});

global.mysqlModel = require('./models/index')

var usersRouter = require('./routes/users.route');
var authRouter = require('./routes/auth.route');
app.use('/users', usersRouter);
app.use('/auth', authRouter);


app.use((req, res, next) => {
  let error = {
		status: 404,
		source: "Request: " + req.url + " :: " + req.method, type: "error",
		content: "Page not found"
	};
	next(error)
})

// error handler
app.use((err, req, res, next) => {
  let scode = err.status ? parseInt(err.status) : 500;
	console.log(err)
	let errorresponse = {
		errorMessage: err.content && err.content.message ? err.content.message : err.content,
		status_code: scode
	}
  res.status(scode).json(errorresponse);
})



module.exports = app;
