const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require("./dbConfig");
const cors = require('cors');
const router = express.Router();
const users = db.users;
const customMenus = db.usersCustomMenus;
const usersTodos = db.usersTodos;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let data = {
    "data": "",
    "error": false,
    "message": "",
    "status": "OK"
};


/* -------- Check User Available or not based mobile and email --------- */
async function checkUserAvail(email) {
    return new Promise(resolve => {
        let returnVal = false;
        users.find({ "email": email }, (err, user) => {
            if (err) return next(err);
            if (user.length > 0) {
                returnVal = true;
            }
            resolve(returnVal);
        });
    });
}

app.get('/api/users', (req, res) => {
    const param = req.query.user;
    users.find({}, (err, users) => {
        if (err) return next(err);
        data['data'] = users;
        data['status'] = "OK";
        res.json(data);
    });
});


/* User Regsisteration form submit*/
app.post('/api/register', (req, res) => {
    const email = req.body.email;
    const formData = req.body;
    checkUserAvail(email).then(results => {
        if (!results) {
            users.create(formData, (err, response) => {
                if (err) return next(err);
                data["message"] = "Registered Successfully";
                data["data"] = response;
                data["status"] = "OK";
                data["error"] = false;
                res.json(data);
            });
        } else {
            data["message"] = "Already Email is exists";
            data["status"] = "ERR";
            data["error"] = true;
            res.json(data);
        }
    }).catch(err => {
        data['message'] = "Error found in API";
        data['status'] = "ERR";
        data['data'] = '';
        res.json(data);
    });
});

/* User Login form submit*/
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    users.find({
        $and: [{
            "email": email
        }, {
            "password": password
        }]
    },
        (err, userRow) => {
            if (err) return next(err);
            if (userRow.length > 0) {
                data['data'] = userRow;
                data['status'] = "OK";
                data["message"] = "Login Successfully";
                data["error"] = false;
            }
            else {
                data["message"] = "Email and password doesnot match, New User Pls Register ";
                data["status"] = "ERR";
                data["error"] = true;
                data["data"] = "";
            }
            res.json(data);
        });
});

/* User Email Validate Login and Regsiter */
app.post('/api/validateEmail', (req, res) => {
    const email = req.body.email;
    checkUserAvail(email).then(results => {
        if (results) {
            data["status"] = "ERR";
            data["message"] = "Already Email Available";
            data["data"] = "";
        } else {
            data["message"] = "New Email";
            data["status"] = "OK";
            data["data"] = "";
        }
        res.json(data);
    }).catch(err => {
        data['message'] = "Error found in API";
        data['status'] = "ERR";
        data['data'] = '';
        res.json(data);
    });
});

/* User add new menu in list insert  */
app.post('/api/addMenu', (req, res) => {
    const formData = req.body;
    customMenus.create(formData, (err, response) => {
        if (err) return next(err);
        data["message"] = "New Menu added Successfully";
        data["data"] = response;
        data["status"] = "OK";
        data["error"] = false;
        res.json(data);
    });
});

/* Based on user login get custom menu names get*/
app.post('/api/getUserCustomMenus', (req, res) => {
    const userID = req.body.user;
    customMenus.find({ "user_id": userID }, (err, userMenus) => {
        if (err) return next(err);
        if (userMenus.length > 0) {
            data["status"] = "OK";
            data["message"] = "Custom menus are added";
            data["data"] = userMenus;
        }
        else {
            data["message"] = "No Custom menus are added";
            data["status"] = "ERR";
            data["data"] = "";
        }
        res.json(data);
    });
});

/* add and update todo list to the user */
app.post('/api/addEditTodo', (req, res) => {
    const userID = req.body.user;
    const taskName = req.body.taskName;
    const taskTodo = req.body.taskTodo;
    const created_at = req.body.created_at;
    const action = req.body.taskAction;
    const rowId = req.body.editID;
    const taskPriority = req.body.taskPriority;
    let taskDuedate = req.body.taskDuedate;

    const formData = {
        "user_id": userID,
        "menu_id": 0,
        "todo_name": taskName,
        "todo_type": taskTodo,
        "todo_status": 0,
        "todo_priority": taskPriority,
        "created_at": created_at,
        "completed_at": "",
        "due_date": taskDuedate,
    };

    if (action === "Add") {
        usersTodos.create(formData, (err, response) => {
            if (err) return next(err);
            data["message"] = "New todo added Successfully";
            data["status"] = "OK";
            data["data"] = response._id;
            data["error"] = false;
            res.json(data);
        });
    } else {
        usersTodos.update({
            $and: [
                { "user_id": userID },
                { "_id": rowId },
                { "todo_type": taskTodo }
            ]
        }, {
                $set: [
                    { 'todo_name': taskName },
                    { "todo_priority": taskPriority },
                    { "due_date": taskDuedate }
                ]
            }, {
                w: 1, multi: false
            }, (err, result) => {
                if (err) return next(err);
                data["message"] = "Todo Successfully Edited";
                data["status"] = "OK";
                data["data"] = result._id;
                data["error"] = false;
                res.json(data);
            });
    }
});

/* get users added todolists*/
app.post('/api/getUserTodoLists', (req, res) => {
    const userID = req.body.user;

    usersTodos.find({ "user_id": userID }, (err, usertodos) => {
        if (err) return next(err);
        if (usertodos.length != 0) {
            data["status"] = "OK";
            data["message"] = "Todo lists are available";
            data["data"] = usertodos;
        } else {
            data["message"] = "Empty Todo lists";
            data["status"] = "ERR";
            data["data"] = "";
        }
        res.json(data);
    });
});

/* delete todo in todolists*/
app.post('/api/deleteTodo', (req, res) => {
    const userID = req.body.user;
    const taskType = req.body.taskTodo;
    const taskRowId = req.body.rowId;
    usersTodos.deleteOne({ "_id": taskRowId }, function (err, row) {
        if (err) throw err;
        data["status"] = "OK";
        data["message"] = taskType + " Todo is Deleted";
        data["data"] = row;
        res.json(data);
    });
});

/* update todo status in todolists*/
app.post('/api/updateTodoStatus', (req, res) => {
    const userID = req.body.user;
    const taskType = req.body.taskTodo;
    const taskRowId = req.body.rowId;
    const todoStatus = req.body.taskStatus;
    const completed_at = req.body.completed_at;

    usersTodos.update({
        "_id": taskRowId
    }, {
            $set: [
                { 'completed_at': completed_at },
                { "todo_status": todoStatus }
            ]
        }, {
            w: 1, multi: true
        }, (err, result) => {
            if (err) return next(err);
            data["message"] = "Updated Successfully";
            data["status"] = "OK";
            data["data"] = "";
            data["error"] = false;
            res.json(data);
        });
});

app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Node app is running on port " + port);
});
