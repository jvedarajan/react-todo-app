/*const mysql = require('mysql');
// connection configurations
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_db',
    dateStrings:true,
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  module.exports = con; */

  const mongoose = require('mongoose');
  const userModel = require('./models/user');
  const userCustomMenusModel = require('./models/usercustommenus');
  const usersTodosModel = require('./models/userstodos');

  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost:27017/todo_db', ({ useNewUrlParser: true }))
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
  exports.users = userModel;
  exports.usersCustomMenus = userCustomMenusModel;
  exports.usersTodos = usersTodosModel;
  
