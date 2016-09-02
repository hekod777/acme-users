// just name this file users.
var models = require('../models');
var Promise = require('bluebird');
var Departments = models.Departments;
var Users = models.Users;
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  Promise.all([
    Users.findAll({ where: { departmentId: null }}),
    Departments.findDefault()
  ])
  .spread(function(users, department){
    res.render('customers', {
      users: users,
      defaultDepartment: department 
    });
  })
  .catch(next);
});


router.post('/', function(req, res, next){
	Users.create({
		name: req.body.name
	})
  .then (function(){
    res.redirect('/users');
  })
  .catch(next);
});

router.put('/:id', function(req, res, next){
  Promise.all([
    Users.findById(req.params.id),
    Departments.findDefault()
  ])
  .then(function(user, department){
    user.departmentId = department.id;
    return user.save();
  })
  .then(function(user){
    res.redirect('/departments/' + user.departmentId);
  })
  .catch(next);
});

router.delete('/:id', function(req, res, next){
  Users.destroy({ where: { id: req.params.id }})
    .then(function(){
      res.redirect('/users');
    })
    .catch(next);
});

module.exports = router;
