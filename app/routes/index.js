'use strict';
  
var express = require('express');
var router = express.Router();
var path = require('path');

var passportGithub = require('../auth/github');
var passportFacebook = require('../auth/facebook');
var passportLocal = require('../auth/local');
var localRegister = require('../auth/localRegister');

var path = process.cwd();
var DataController = require(path + '/app/controllers/dataController.js');
         
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
  	return next();
  } else {
    console.log("failed to log in!");
    next();
  }
}

var dataController = new DataController();

router.get('/', dataController.getData, function(req, res){
  res.render('index', {data: req.Data });
});

router.get('/home', isLoggedIn, dataController.getUser, function(req, res){
   res.render('mybooks', {
     userID: req.UserID,
     userBooks: req.UserInfo});
});

router.get('/myaccount', dataController.getUser, function(req, res){
  res.render('myaccount', {
     userTitle: req.user.username,
     userInfo: req.UserInfo});
});

router.get('/allbooks', isLoggedIn, dataController.getUser, dataController.getData, function(req, res){
  res.render('allbooks', {
    userID: req.UserID,
    data: req.Data} );
});

router.get('/logout', function(req, res){
			res.redirect('/');
});

router.get('/auth/github', passportGithub.authenticate('github'));

router.get('/auth/github/callback',
  passportGithub.authenticate('github', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', {
    successRedirect: '/home',
    failureRedirect: '/login'
  }));

router.post('/auth/local',
  passportLocal.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

router.post('/adduser',
  localRegister.authenticate('localRegister', {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

module.exports = router;
