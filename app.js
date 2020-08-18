var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');
var datadateRouter = require('./routes/datadate')
var mapsRouter = require('./routes/maps')

mongoose.connect('mongodb://localhost/cmssdb', {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session ({
    secret: 'dwikoadya',
    resave: false,
    saveUninitialized: true
}))

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/data', dataRouter)
app.use('/api/datadate', datadateRouter)
app.use('/api/maps', mapsRouter)


module.exports = app;
