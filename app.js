var express = require('express');
var app = express();
var swig = require('swig');
var models = require('./models/index');
var bodyParser = require('body-parser');
var Departments = models.Departments;
var Users = models.Users;
var departmentsRouter = require('./routes/departmentsroutes');
var usersRouter = require('./routes/usersroutes');
var methodOverride = require('method-override');


app.set('view engine', 'html');
app.engine('html',swig.renderFile);
swig.setDefaults({cache:false});

app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser());
//app.use(methodOverride());

app.use('/departments', departmentsRouter);
app.use('/users', usersRouter);


app.get('/', function(req,res,next){
	Departments.findDefault()
		.then(function(results){
			res.render('index.html',{
				Ddepartment: results[0],
			});
		})
	 // add more stuff later on
})

//Users.sync({force:true}).then(function(){return Departments.sync({force:true}) })
//.then(function*(){
	app.listen(3000);
//});

//app.listen(3000);
