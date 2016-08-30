var models = require('../models');
var Departments = models.Departments;
var Users = models.Users;
var express = require('express');
var router = express.Router();

router.get('/', function(req,res,next){
	Users.findAll({
		where:{
			departmentId: null
		}
	})
		.then (function(customerss){
			Departments.findDefault()
				.then (function(results){
					res.render('customers', {
					customers:customerss,
					Ddepartment:results[0],
					})
				})
			
		})
})


router.post('/addcustomer', function(req,res,next){
	Users.create({
		name: req.body.name
	})
		.then (function(newCustomer){
			res.redirect('/users');
		})
})

router.get('/tocustomer/:id', function(req,res,next){
	Users.findOne({
		where:{
			id: req.params.id
		}
	})
		.then(function(theuser){
			return theuser.update({
				departmentId: null,
			})
		})
		.then (function(newcustomer){
			res.redirect('/users');
		})
		.catch(next);
})

router.post('/:departmentid/:userid/delete',function(req,res,next){
	Users.findOne({
		where:{
			id:req.params.userid
		}
	})
		.then(function(theuser){
			return theuser.destroy();
		})
		.then(function(result){
			res.redirect('/departments/' + req.params.departmentid)
		})
		.catch(next);
})

router.post('/:customerid/delete', function(req,res,next){
	Users.findOne({
		where:{
			id:req.params.customerid
		}
	})
		.then(function(theuser){
			return theuser.destroy();
		})
		.then(function(){
			res.redirect('/users/')
		})
		.catch(next);
})

router.post('/:userid/toemployee', function(req,res,next){
	Users.findOne({
		where:{
			id:req.params.userid
		}
	})
		.then(function(theuser){
			Departments.findDefault()
				.then(function(defaultDepartment){
					return theuser.update({	
						departmentId: defaultDepartment[0].id
					})
				.then(function(){
					res.redirect('/users/')
				})
			})
		})

		.catch(next);
})

module.exports = router;