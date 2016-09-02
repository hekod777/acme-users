var Sequelize = require('sequelize');
//don't hardcode-- send in as environment variable
var db = new Sequelize('postgres://localhost:5432/acmeusers');

var Users = db.define('user',{
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

//make your models singular Department
// not Departments
var Departments = db.define('department',{
	name:{
		type: Sequelize.STRING,
		allowNull: false,
	},
  //bad naming-- call this isDefault
	defaults : {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	}
},{
	classMethods:{
		findDefault: function(){
			return Departments.findOne({
				where: {
					defaults : true
				}
			})
      .then(function(department){
        if(department)
          return department;
        return Departments.create({
          name: 'Accounting',
          defaults: true
        });
      });
	  }
  }
});

//again.. make singular should be User and Department
Departments.hasMany(Users);
Users.belongsTo(Departments);


module.exports = {
	Users : Users,
	Departments : Departments,
};
