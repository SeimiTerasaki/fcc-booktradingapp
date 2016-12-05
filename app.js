var socketio = require('socket.io');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var async = require('async');
var books = require('google-books-search');

var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

require('dotenv').load();
var app = express();

var io = socketio();
app.io = io;

var routes = require('./app/routes/index');

mongoose.connect(process.env.MONGO_URI);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'app')));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'bookies',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

var User = require('./app/auth/models/user.js');
io.on('connection',function(socket){

function addBook(data){
User.update({'_id': data[3]},
  {$push: {'books': {
  'title': data[0],
  'image': data[1],
  'author': data[2] }} },
   function(err, doc){
     if(err)throw err;
     else{
       null;
      }
  });
}

function addMyRequest(data){
  User.findOneAndUpdate({'_id': data[4]},
  {$push: {'myrequests': {
  'title': data[0],
  'id': data[3] }} },
   function(err, doc){
     if(err)throw err;
     else{
       null;
      }
  });
}

function removeMyRequests(data){
User.findOneAndUpdate({'myrequests.title': data[0],'_id': data[1]},
    {$pull: {'myrequests':{'title': data[0] } }},
     function(err, doc){
       if(err)throw err;
       else{
         null;
        }
    });
}

function removePendingRequest(data){
  User.findOneAndUpdate({'pendingrequests.title': data[0],'_id': data[1]},
    {$pull: {'pendingrequests':{'title': data[0] } }},
     function(err, doc){
       if(err)throw err;
       else{
         null;
        }
  });
}
               
  socket.on('check', function(data, callback){
    books.search(data[0], function(error, results) {
      if ( ! error ) {
        var array = [];
        array.push(results[1].title, results[1].thumbnail, results[1].authors, data[1]);
        callback(array);
        console.log('this is the new array:' + array);
        addBook(array);
        } else {
         callback("error");
        }
    });
  });
  
  socket.on('update', function(data){
    var update = {};
    update[data[1]] = data[2];
  User.findOneAndUpdate({'username': data[0]},
    {$set: update },
     function(err, doc){
       if(err)throw err;
       else{
         null;
        }
    });
  });
  
  socket.on('request', function(data, callback){
   addMyRequest(data);
  User.update({'_id': data[1]},
    {$push: {'pendingrequests': {
      'title': data[0],
      'id':data[2]} }},
     function(err, doc){
       if(err)throw err;
       else{
        null;
        }
    });
  });
  
  socket.on('no-yes', function(data){
  removeMyRequests(data);
  removePendingRequest(data);
  });

  socket.on('cancel', function(data){
  removePendingRequest(data);
  removeMyRequests(data);
  });
  
  socket.on('trash', function(data){
    User.findOneAndUpdate({'_id': data[1]},
    {$pull: {'books':{'title': data[0] } }},
     function(err, doc){
       if(err)throw err;
       else{
         null;
        }
    });
  });
  
});

app.use('/', routes);

module.exports = app;
