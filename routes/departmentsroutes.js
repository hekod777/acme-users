//name this file department.js - it's in the routes folder so you know it is a route
var Promise = require('bluebird');
var models = require('../models');
var Departments = models.Departments;
var Users = models.Users;
var express = require('express');
var router = express.Router();

//give your params some space to breathe :)
router.get('/:id', function(req, res, next){
  Promise.all([
      Departments.findAll(),
      Departments.findById(req.params.id, {
        include: [ Users ]
      }),
      Departments.getDefault()
  ])
  .spread(function(departments, department, defaultDepartment){
    res.render('departments', {
      departments: departments,
      defaultDepartment: defaultDepartment,
      department: department
    });
  })
  .catch(next);
});
  
router.post('/',function(req,res,next){
  Departments.create({
    name: req.body.name
  })
  .then(function(department){
    res.redirect('/departments/' + department.id);
  })
  .catch(next);
});

//make it restful
router.post('/:id/employees', function(req,res,next){
	Users.create({
			name: req.body.employeename,
			departmentId: req.params.id,
	})
  .then (function (employee){
    res.redirect ('/departments/' + req.params.id);
  })
  .catch(next);
});

router.put('/:id', function(req,res,next){
	Departments.findDefault()
		.then (function(department){
      department.defaults = false;
      return department.save();
		})
		.then (function(){
			return Departments.findById(req.params.id);
		})
		.then (function(department){
      department.defaults = true;
      return department.save();
		})
		.then (function(){
			res.redirect('/departments/' + req.params.id);
    })
		.catch(next);
});


module.exports = router;
