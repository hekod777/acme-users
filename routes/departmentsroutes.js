
var models = require('../models');
var Departments = models.Departments;
var Users = models.Users;
var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
	Departments.findAll({})
		.then(function(departments){
			return Departments.findById(req.params.id)	
				.then(function(theDepartment){
					return Users.getEmployees(req.params.id)
						.then(function (employees){
							res.render('departments',{
								departments:departments,
								theDepartment:theDepartment,
								employees:employees,
								Ddepartment:theDepartment,
								currentDepartment:{id: req.params.id},
								showForm: false,
							})
						})
				})

		})
		.catch(next);
})

router.get('/:id',function(req,res,next){
	Departments.findAll({})
		.then(function(departments){
			return Departments.findById(req.params.id)	
				.then(function(theDepartment){
					return Users.getEmployees(req.params.id)
						.then(function (employees){
							res.render('departments',{
								departments:departments,
								theDepartment:theDepartment,
								employees:employees,
								Ddepartment:theDepartment,
								currentDepartment:{id: req.params.id},
								showForm: true,
							})
						})
				})
		})
		.catch(next);
})


router.post('/',function(req,res,next){
 	Departments.findDefault()
 		.then (function(result){
 			if (result.length == 0){
 				return Departments.findOrCreate({
 					where:{
 						name: req.body.departmentname,
 						defaults:true
 					}
 				})
 			}
 			else{
 				return Departments.findOrCreate({
 					where:{
 						name: req.body.departmentname,
 						defaults:false
 					}
 				})
 					
 			}
 		})
 		.then(function(){
 			return Departments.findDefault();
 		})
 		.then (function(thedefault){
 			res.redirect('/departments/' + thedefault[0].dataValues.id)
 		})
 		.catch(next);
 })

router.post('/:id/addemployee', function(req,res,next){
	console.log ('the id is',req.params.id);
	Users.create({
		
			name: req.body.employeename,
			departmentId: req.params.id,
		
	})
		.then (function (newEmployee){
			res.redirect ('/departments/' + req.params.id)
		})
		.catch(next);
})

router.post('/:id/todefault', function(req,res,next){
	Departments.findDefault()
		.then (function(defaultDepartment){
			return defaultDepartment[0].update({
				defaults: false
			})
		})
		.then (function(){
			return Departments.findById(req.params.id);
		})
		.then (function(newDefault){
			newDefault.update({
				defaults:true
			})
		})
		.then (function(){
			res.redirect('/departments/' + req.params.id)
		})
		.catch(next);
})


module.exports = router;