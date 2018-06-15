

const mysql = require('mysql');

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
  module.exports = con;
  
