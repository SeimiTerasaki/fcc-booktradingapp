'use strict';

var User = require('../auth/models/user.js');

function dataController() {

this.getData = function(req, res, next){
  User.find({},{books:1, address:1}, function(err, doc){
    if(err)throw err;
      else{
    console.log(doc);
    req.Data = doc;
    next();
    }
  });
};

this.getUser = function(req, res, next){
  User.find({'username': req.user.username}, function(err, doc){
    if(err)throw err;
      else{
     req.UserInfo = doc;
     req.UserID = doc[0]._id;
     next();
    }
  });
};


}

module.exports = dataController;