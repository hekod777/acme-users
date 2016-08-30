var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/acmeusers');



var Users = db.define('user',{
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	}
},{
	classMethods: {
		getEmployees: function(theid){
			return Users.findAll({
				where:{
					departmentId : theid
				}
			})
				.catch(console.log.bind(console));
		}
	},

	//  tried to use these instance methods to do the updates but FAIL

	instanceMethods:{
		toEmployee: function(){
			Departments.findOne({
				where:{
					defaults: true
				}
			})
				.then(function(defaultDeparment){
					this.departmentId = defaultDeparment.id;
					this.save();
				})
				.catch(console.log.bind(console));
	 	},
	 	toCustomer: function(){
	 		return this.update({
	 			departmentId: null,
	 		});
	 	},
	// 	tried to use these instance methods to do the updates but FAIL
	}
});

var Departments = db.define('department',{
	name:{
		type: Sequelize.STRING,
		allowNull: false,
	},
	defaults : {
		type: Sequelize.BOOLEAN,
		//allowNull: false,
		//defaultValue: false,
	}
},{
	// hooks:{
	// 	beforeUpdate: function(department){
	// 		Departments.findAll({
	// 			where : {
	// 				defaults : true
	// 			}
	// 		})
	// 			.then (function(results){
	// 				//console.log (results);
	// 				//console.log (typeof results);
	// 				//console.log (results.length);
	// 				if (results.length === 0){
	// 					console.log ('so true');
	// 					department.set ('defaults', true);
	// 					//department.setDataValue('default', true);
	// 				}
	// 				else {
	// 					console.log ('false');
	// 					return department.defaults = false;
	// 					//department.setDataValue('default', false);
	// 				}
	// 			})
	// 			//.catch(console.log.bind(console));
	// 	}
	classMethods:{
		findDefault: function(){
			return Departments.findAll({
				where: {
					defaults : true
				}
			})
	},


}

});


Departments.hasMany(Users);
Users.belongsTo(Departments);


module.exports = {
	Users : Users,
	Departments : Departments,
};