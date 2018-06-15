const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const con = require("./dbConfig");
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
var router = express.Router();
router.get('/api/hello', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
app.get('/api/users', function (req, res) {
    con.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Users list.', status: "OK" });
    });
});

let data = {
    "data": "",
    "error": false,
    "message": "",
    "status": "OK"
};
/* User Regsisteration form submit*/
app.post('/api/register', function (req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const createdTime = req.body.currenttime;
    
    con.query("SELECT id from users WHERE email=?  LIMIT 1", [email], function (err, rows, fields) {
        if (rows.length != 0) {
            data["message"] = "Already Email is exists";
            data["status"] = "ERR";
            return res.send(data);
        } else {
            con.query("INSERT INTO users (firstname, lastname,email,password,created_at) VALUES" +
                "('" + firstname + "', '" + lastname + "','" + email + "','" + pass + "','" + createdTime + "')", function (err, result) {
                    if (err) throw err;
                    data["message"] = "Registered Successfully";
                    data["data"] = result;
                    data["status"] = "OK";
                    data["error"] = true;
                });
            return res.send(data);
        }
    });
});

/* User Login form submit*/
app.post('/api/login', function (req, res) {
    const email = req.body.email;
    const pass = req.body.password;
    con.query("SELECT id,firstname,lastname from users WHERE email=? and password=? Limit 1", [email, pass], function (err, rows, fields) {
        if (rows.length != 0) {
            data["status"] = "OK";
            data["message"] = "Login Successfully";
            data["error"] = false;
            data["data"] = rows;
        } else {
            data["message"] = "Email and password doesnot match, New User Pls Register ";
            data["status"] = "ERR";
            data["error"] = true;
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* User Email Validate Login and Regsiter */
app.post('/api/validateEmail', function (req, res) {
    const email = req.body.email;
    con.query("SELECT id from users WHERE email=?", [email], function (err, rows, fields) {
        if (rows.length != 0) {
            data["status"] = "ERR";
            data["message"] = "Already Email Available";
            data["data"] = "";
        } else {
            data["message"] = "New Email";
            data["status"] = "OK";
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* User add new menu in list insert  */
app.post('/api/addMenu', function (req, res) {
    const menu = req.body.menu;
    const path = req.body.path;
    const userId = req.body.user;
    const display_order = req.body.display_order;
    const created_at = req.body.created_at;
  
    const sql = "INSERT INTO users_custom_menus (user_id, menu_display_order,menuname,path,created_at) VALUES ('"+userId+"','"+display_order+"','"+menu+"','"+path+"','"+created_at+"')";
     con.query(sql, function (err, result) {
    if (err) throw err;
     if(result.affectedRows>=1){
        data["message"] = "New Menu added Successfully";
        data["status"] = "OK";
        data["data"] = "";
     }else{
        data["message"] = "New Menu not added";
        data["status"] = "ERR";
        data["data"] = "";
     }
     return res.send(data);
  });
});

/* Based on user login get custom menu names get*/
app.post('/api/getUserCustomMenus', function (req, res) {
    const userID = req.body.user;

    con.query('SELECT menuname,path,created_at,menu_display_order FROM users_custom_menus WHERE user_id=? ',[userID], function (error, rows, fields) {
        if (error) throw error;
        if (rows.length != 0) {
            data["status"] = "OK";
            data["message"] = "Custom menus are added";
            data["data"]   = rows ;
        } else {
            data["message"] = "No Custom menus are added";
            data["status"] = "ERR";
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* add and update todo list to the user */
app.post('/api/addEditTodo', function (req, res) {
    const userID = req.body.user;
    const taskName = req.body.taskName;
    const taskTodo = req.body.taskTodo;
    const created_at = req.body.created_at;
    const action = req.body.taskAction;
    const rowId = req.body.editID;
    
    let sql;
    if(action==="Add"){
        sql = "INSERT INTO users_todo_lists (user_id, todo_name,todo_type,created_at) VALUES ('" + userID + "','" + taskName + "','" + taskTodo + "','" + created_at + "')";
    }else{
        sql = "UPDATE users_todo_lists SET todo_name = '"+taskName+"' WHERE user_id = '"+userID+"' AND todo_type ='"+taskTodo+"' AND id= '"+rowId+"'";
    }
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            data["message"] = "New todo added Successfully";
            data["status"] = "OK";
            if(action==="Add"){
                data["data"]   = result.insertId;
            }else{
                data["data"]   = result.rowId;
            }
        } else {
            data["message"] = "todo not updated ";
            data["status"] = "ERR";
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* get users added todolists*/
app.post('/api/getUserTodoLists', function (req, res) {
    const userID = req.body.user;
    
    con.query('SELECT * FROM users_todo_lists WHERE user_id=? ',[userID], function (error, rows, fields) {
        if (error) throw error;
        if (rows.length != 0) {
            data["status"] = "OK";
            data["message"] = "Todo lists are available";
            data["data"]   = rows ;
        } else {
            data["message"] = "Empty Todo lists";
            data["status"] = "ERR";
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* delete todo in todolists*/
app.post('/api/deleteTodo', function (req, res) {
    const userID = req.body.user;
    const taskType = req.body.taskTodo;
    const taskRowId = req.body.rowId;
    con.query('DELETE FROM users_todo_lists WHERE user_id=? and id=? and todo_type=?',[userID,taskRowId,taskType], function (error,result) {
      
        if (error) throw error;
        if (result.affectedRows >= 0) {
            data["status"] = "OK";
            data["message"] = "Deleted Successfully";
            data["data"] = "";
        } else {
            data["message"] = taskType+" todo is not deleted";
            data["status"] = "ERR";
            data["data"] = "";
        }
        return res.send(data);
    });
});

/* update todo status in todolists*/
app.post('/api/updateTodoStatus', function (req, res) {
    const userID = req.body.user;
    const taskType = req.body.taskTodo;
    const taskRowId = req.body.rowId;
    const todoStatus  = req.body.taskStatus;
    const completed_at  = req.body.completed_at;
   var sql = "UPDATE users_todo_lists SET completed_at = '"+completed_at+"',todo_status = '"+todoStatus+"' WHERE id= '"+taskRowId+"'"; 

   con.query(sql, function (error, result) {
        if (error) throw error;
        if (result.affectedRows >= 0) {
            data["status"] = "OK";
            data["message"] = "updated Successfully";
            data["data"] = "";
        } else {
            data["message"] = "not updated";
            data["status"] = "ERR";
            data["data"] = "";
        }
        return res.send(data);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log('Node app is running on port ' + port);
});
/*var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    
  });*/

//module.exports = app;