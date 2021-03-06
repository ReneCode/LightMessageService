var express = require('express');
var http = require('http');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStragety = require('passport-local').Strategy

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport
app.use(require('express-session')( {
  secret: 'mySecret',
  resave: false,
  sveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// passport
let Account = require('./models/account')
passport.use(new LocalStragety(Account.authenticate()))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())



// mongoose
mongoose.Promise = global.Promise;


/* 
  mongo connectionString
    mongodb://<user>:<password>@<host>:<port>/<database>
*/

let mongodb_host = process.env.MONGODB_HOST || 'localhost'
let mongodb_port = process.env.MONGODB_PORT || '27017'
let mongodb_database = process.env.MONGODB_DATABASE || 'lightmessage'

let mongodb_user = process.env.MONGODB_USER || ''
let mongodb_password = process.env.MONGODB_PASSWORD || ''

let connection_string =  mongodb_host + ":" + mongodb_port
if (mongodb_user) {
  connection_string = mongodb_user + ":" + mongodb_password + "@" + connection_string;
}

connection_string = 'mongodb://' + connection_string + "/" + mongodb_database

mongoose.connect(connection_string, function(err) {
  if (err) {
    console.log('### cant connect mongo. server will be closed', err);
    server.close();
  }
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/lights', require('./routes/lights'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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





var server = http.createServer(app);


server.on('close', function() {
  console.log("server closing")
  mongoose.models = [];
  mongoose.connection.close();
})


module.exports = server;
