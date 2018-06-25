import React from 'react';
import userphoto from '../images/user_icon.png';
import { Route, BrowserRouter as HashRouter, NavLink, Switch } from 'react-router-dom';
//import { Redirect } from 'react-router'
import DashboardContent from "./DashboardContent";
import MyDay from "./MyDay";
import ToDo from "./ToDo";
import TasksComponent from "./TasksComponent";
import UsersChatComponent from "./UsersChatComponent";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
const w = moment().weekday();
const daysToSubtract = ((w + 3 + Math.floor(24/16)))%7 ;
const beginningOfWeek = moment().add(-daysToSubtract, 'days');
const endOfWeek = moment().add(14-daysToSubtract, 'days');
//console.log(beginningOfWeek.format('YYYY-MM-DD h:mm:ss'));
document.onclick = function () {
        const thisElement = document.getElementById("newlist");
        if (thisElement) {
                thisElement.classList.remove('hide');
                thisElement.nextSibling.classList.add('hide');
        }
}
class Dashboard extends React.Component {
        constructor(props) {
                super(props);
                const propsVals = this.props.states;
                this.state = { "newListAdded": [], dueDate: moment(), datetime: this.getCurrentTime(), datetime2: this.getCurrentTime('db'), menus: propsVals.menus, userRowIndex: propsVals.userRowIndex, allUsersInfo: propsVals.allUsersInfo, loggedUser: propsVals.loggedUser, loggedUserName: propsVals.loggedUserName };

                this.handleChange = this.handleChange.bind(this);
        }
        handleChange(date) {
                //  let formattedDate = this.formatDate(date);
                this.setState({
                        dueDate: date
                });
        }

        componentDidMount = () => {
                const propsVals = this.props.states;
                //  this.getCustomTasks();
                this.callApigetCustomMenus(propsVals.userRowIndex);
        }
        getCustomTasks = () => {
                const newListAdded = [];
                const getMenus = this.state.menus;
                Object.keys(getMenus).map(function (menuObject, ind) {
                        if (getMenus[menuObject].type === 'custom') {
                                newListAdded.push({ "path": "/" + getMenus[menuObject].menuname.toLowerCase(), "component": "TasksComponent", "task": getMenus[menuObject].menuname });
                        }
                });
                this.setState({ newListAdded: newListAdded });
        }
        getTime = () => {
                this.setState({ datetime: this.getCurrentTime() });
                setTimeout(this.getTime.bind(this), 30000);
        }
        getCurrentTime = (passdb) => {
                const today = new Date();
                let h = this.checkTime(today.getHours());
                const m = this.checkTime(today.getMinutes());
                const s = this.checkTime(today.getSeconds());
                const date = this.checkTime(today.getDate());
                const month = this.checkTime(today.getMonth() + 1);
                const year = today.getFullYear();
                if (passdb) {
                        const currentDateTime = year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
                        return currentDateTime;
                } else {
                        let setPeriod = "AM";
                        if (h > 11) {
                                setPeriod = "PM";
                                if (h !== 12) {
                                        h = h - 12;
                                }
                        }
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        const displaydatetime = months[Math.round(month) - 1] + " " + date + ", " + year + "  " + h + ":" + m + "  " + setPeriod;
                        return displaydatetime;
                }
        }
        checkTime = (i) => {
                if (i < 10) {
                        i = "0" + i;
                }
                return i;
        }
        hasClass = (element, cls) => {
                const returnFlag = (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
                return returnFlag;
        }
        /* Display List of Menu Items*/
        getMenuData = () => {
                const userMenus = this.state.menus;
                return Object.keys(userMenus).map(function (menus, i) {
                        const listsLength = userMenus[menus].added_lists.length;
                        let countShow;
                        if (listsLength === 0) {
                                countShow = '';
                        } else {
                                countShow = listsLength;
                        }
                        return <li key={userMenus[menus].menuname} className="menu" data-menu={userMenus[menus].menuname} data-display={userMenus[menus].display_order}><i className={userMenus[menus].iconclass} aria-hidden="true"></i>   <NavLink to={userMenus[menus].path}><span className="menu_itemname">{userMenus[menus].menuname}</span> <span className="menu_itemcount">{countShow}</span></NavLink></li>;
                });
        }
        handleAddNew = (e) => {
                /* const userRowIndex = this.state.userRowIndex;
                 const userMenus = this.state.menus;
                 const userInformation = this.state.allUsersInfo;
                 const usersRow = this.state.allUsersInfo.users;*/
                const newlistElement = this.refs.newlist;
                newlistElement.classList.add('hide');
                newlistElement.nextSibling.classList.remove('hide');
                const target = e.target || e.srcElement;
                const checkClickAddNew = this.hasClass(target, 'addNewList');
                if (checkClickAddNew) {
                        const newList = this.refs.addNewListName.value.trim();
                        if (newList !== '') {
                                this.callApiAddMenuTask(newList, newlistElement);
                                /*  const key = newList;
                                  const createMenuObj = {};
                                  const createJSON = {
                                          "menuname": newList, "iconclass": "fa fa-asterisk", "added_lists": [],
                                          "display_order": Object.keys(userMenus).length + 1,
                                          "created_at": this.getCurrentTime(),
                                          "type": "custom",
                                          "path": "/" + newList.toLowerCase(),
                                          "component": "TasksComponent"
                                  };
                                  createMenuObj[key] = createJSON;
                                  newListAdded.push({ "path": "/" + newList.toLowerCase(),"component": "TasksComponent","task":newList});
                                  newlistElement.classList.remove('hide');
                                  newlistElement.nextSibling.classList.add('hide');
                                  const oldMenus = usersRow[userRowIndex].userMenus;
                                  const newMenusAdd = Object.assign({}, oldMenus, createMenuObj);
                                  delete usersRow[userRowIndex].userMenus;
                                  usersRow[userRowIndex].userMenus = newMenusAdd;
                                  localStorage.setItem('userInfo', JSON.stringify(userInformation));
                                  this.setState({ menus: newMenusAdd });
                                  this.getMenuData();*/
                        }
                } else {
                        this.refs.addNewListName.value = '';
                }
        }
        handleClickCloseModal = () => {
                const modal = this.refs.modalTask;
                modal.style.display = "none";
                const modal2 = this.refs.modalDeleteTask;
                modal2.style.display = "none";
        }
        handleSubmitTask = () => {
                const taskIPElem = this.refs.task_name;
                const taskAction = this.refs.task_action.innerText;
                const taskName = this.refs.task_name.value;
                const taskTodo = this.refs.task_type.value;
                const menus = this.state.menus;
                const taskIndex = this.refs.edit_index.value;
                const taskRow = this.refs.edit_row.value;
                const taskPriorityElem = this.refs.task_priority;
                const taskDuedateElem = this.refs.due_date;
                const taskPriority = taskPriorityElem.value ;
                const duedate = this.state.dueDate;
                let taskDuedate;
                if(duedate!=="" && duedate!==undefined && duedate!==null){
                         taskDuedate  = this.state.dueDate.format("YYYY-MM-DD")+" 23:59:59" ;
                }else{
                        taskDuedate  = "";
                        this.setState({dueDate:moment()});
                }
               
                //  const userInformation = this.state.allUsersInfo;
                const menusRow = menus[taskTodo];
                if (taskName !== "" && taskName.length > 10 && taskPriority!=="") {
                        taskIPElem.classList.remove('invalid');
                        taskIPElem.nextElementSibling.classList.add('hide');
                        if (menusRow.menuname === taskTodo) {
                                if (taskAction === "Edit") {
                                        menusRow.added_lists[taskIndex].title = taskName;
                                        //menusRow.added_lists[taskIndex].due_date = duedate;
                                        menusRow.added_lists[taskIndex].priority = taskPriority;
                                }
                                if (taskAction === "Add") {
                                        const createNewTask = { title: taskName, created_at: this.getCurrentTime("db"), status: "pending", completed_at: "",due_date:duedate,priority:taskPriority };
                                        menusRow.added_lists.push(createNewTask);
                                }
                        }
                        // localStorage.setItem('userInfo', JSON.stringify(userInformation));
                        const passData = {taskTodo:taskTodo,taskName:taskName,taskAction:taskAction,editID:taskRow,taskPriority:taskPriority,taskDuedate:taskDuedate};
                        this.callApiAddEditTodo(passData);
                        this.setState({ menus: menus });
                        //   this.handleClickCloseModal();
                } else {
                        taskIPElem.classList.add('invalid');
                        taskIPElem.nextElementSibling.classList.remove('hide');
                }
                if(taskPriority===""){
                        taskPriorityElem.classList.add('invalid');
                        taskPriorityElem.nextElementSibling.classList.remove('hide');
                        taskIPElem.classList.remove('invalid');
                        taskIPElem.nextElementSibling.classList.add('hide');
                }else{
                        taskPriorityElem.classList.remove('invalid');
                        taskPriorityElem.nextElementSibling.classList.add('hide');  
                }
                if(taskDuedate===""){
                       // taskDuedateElem.classList.add('invalid');
                       // taskDuedateElem.nextElementSibling.classList.remove('hide');
                }else{
                   //     taskDuedateElem.classList.remove('invalid');
                    //    taskDuedateElem.nextElementSibling.classList.add('hide');  
                }
        }
        handleCheckInput = (event) => {
              //  const taskInput = this.refs.task_name;
              //  const taskInputVal = taskInput.value;
                const target = event.target || event.srcElement;
                if (target.value === "") {
                        target.classList.add('invalid');
                        target.nextElementSibling.classList.remove('hide');
                } else {
                        target.classList.remove('invalid');
                        target.nextElementSibling.classList.add('hide');
                }
        }
        handleTaskDelete = () => {
                const taskType = this.refs.delete_task_type.value;
                const deleteIndex = this.refs.delete_task_index.value;
                const deleteRow = this.refs.delete_task_row.value;
                const menus = this.state.menus;
                // const userInformation = this.state.allUsersInfo;
                let lists = menus[taskType].added_lists;
                /*  var newArr = [];
                  for (var i = 0; i < lists.length; i++) {
                          if (i !== deleteIndex) {
                                  newArr.push(lists[i]);
                          }
                  }
                  delete menus[taskType].added_lists;
                  menus[taskType].added_lists = newArr;
                  this.setState({ menus: menus });*/
                //   localStorage.setItem('userInfo', JSON.stringify(userInformation));
                menus[taskType].added_lists = [];
                this.callApiDeleteTodo(taskType, deleteRow, deleteIndex);
        }
        handleClickLogout = () => {
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('userRow');
                //  return <Redirect to='/'/>; 
                window.location.href = "http://localhost:3000";
        }
        handleShowSideMenu = (elem) => {
                const displayType = this.refs.menu_icon.getAttribute("data-display");
                if (displayType === "show") {
                        this.refs.side_nav.style.display = "block";
                        this.refs.menu_bar.style.left = "120px";
                        this.refs.menu_icon.setAttribute('data-display', 'hide');
                } else {
                        this.refs.side_nav.style.display = "none";
                        this.refs.menu_bar.style.left = "10px";
                        this.refs.menu_icon.setAttribute('data-display', 'show');
                }
        }
        /* Api call for user adding new menu in list*/
        callApiAddMenuTask = async (newMenuName, ipelement) => {
                const _this = this;
                const userMenus = _this.state.menus;
                const displayOrder = Object.keys(userMenus).length + 1;
                const setPath = "/" + newMenuName.toLowerCase();
                const response = await fetch('/api/addMenu',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        menu: newMenuName,
                                        path: setPath,
                                        user: _this.state.userRowIndex,
                                        display_order: displayOrder,
                                        created_at: _this.getCurrentTime('dbdateformat'),
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        const createJSON = {
                                "menuname": newMenuName, "iconclass": "fa fa-asterisk", "added_lists": [],
                                "display_order": displayOrder,
                                "created_at": _this.getCurrentTime(),
                                "type": "custom",
                                "path": setPath,
                                "component": "TasksComponent"
                        };
                        const key = newMenuName;
                        const createMenuObj = {};
                        createMenuObj[key] = createJSON;
                        const newMenusAdd = Object.assign({}, userMenus, createMenuObj);
                        _this.setState({ menus: newMenusAdd });
                        ipelement.classList.remove('hide');
                        ipelement.nextSibling.classList.add('hide');
                        _this.getMenuData();
                        //_this.getCustomTasks();

                } else {
                        alert("Error Occured Try again later");
                }
        }
        /* get user's Custom Menus*/
        callApigetCustomMenus = async (id) => {
                const _this = this;
                const response = await fetch('/api/getUserCustomMenus',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: id
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        const data = body.data;
                        data.map(custommenus => {
                                const menuName = custommenus.menuname;
                                const getStateMenus = _this.state.menus;
                                const createJSON = {
                                        "menuname": menuName, "iconclass": "fa fa-asterisk", "added_lists": [],
                                        "display_order": custommenus.menu_display_order,
                                        "created_at": custommenus.created_at,
                                        "type": "custom",
                                        "path": custommenus.path,
                                        "component": "TasksComponent"
                                };
                                const key = menuName;
                                const createMenuObj = {};
                                createMenuObj[key] = createJSON;
                                const newMenusAdd = Object.assign({}, getStateMenus, createMenuObj);
                                _this.setState({ menus: newMenusAdd });

                        });
                        //  console.log(_this.state.menus);
                }
                this.callApiGetTodoLists();
        }
        callApiAddEditTodo = async (data) => {
                //console.log(data);
                const _this = this;
               const response = await fetch('/api/addEditTodo',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: _this.state.userRowIndex,
                                        taskTodo: data.taskTodo,
                                        taskName: data.taskName,
                                        taskAction: data.taskAction,
                                        created_at: _this.getCurrentTime('dbdateformat'),
                                        editID: data.editID,
                                        taskPriority:data.taskPriority,
                                        taskDuedate:data.taskDuedate
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        _this.handleClickCloseModal();
                        if (data.taskAction === "Add") {
                                _this.refs.edit_row = body.data;
                                _this.refs.delete_task_row = body.data;
                        }

                }
        }
        callApiDeleteTodo = async (taskTodo, rowId, deleteIndex) => {
                const _this = this;
                const response = await fetch('/api/deleteTodo',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: _this.state.userRowIndex,
                                        taskTodo: taskTodo,
                                        rowId: rowId
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        _this.callApiGetTodoLists("callback");
                        _this.handleClickCloseModal();

                }
        }
        callApiGetTodoLists = async (callback) => {
                const _this = this;
                const response = await fetch('/api/getUserTodoLists',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: _this.state.userRowIndex
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        const getTodoLists = body.data;
                        const userTodos = _this.state.menus;
                        getTodoLists.map(todos => {
                                const getTodoType = todos.todo_type;
                                if (callback) {
                                        userTodos[getTodoType].added_lists = [];
                                }
                                let status = todos.todo_status;
                                if (status === 0) {
                                        status = "pending";
                                } else if (status === 1) {
                                        status = "completed";
                                }
                                const addTodoListObj = { "status": status, "title": todos.todo_name, "task": todos.todo_type, "created_at": todos.created_at, "id": todos.id, "completed_at": todos.completed_at,"due_date": todos.due_date};
                                userTodos[getTodoType].added_lists.push(addTodoListObj);
                        });
                        _this.setState({ menus: userTodos });
                }
        }
        handleDynamicComponent = () => {
                const getMenus = this.state.menus;
                const _this = this;
                return Object.keys(getMenus).map(function (menuObject, ind) {
                        if (getMenus[menuObject].menuname !== 'To-Do' && getMenus[menuObject].menuname !== "My-Day" && getMenus[menuObject].menuname !== "Dashboard") {
                                return <Route key={getMenus[menuObject].path} path={getMenus[menuObject].path} render={(props) => <TasksComponent {...props} states={_this.state} taskType={getMenus[menuObject].menuname} />} />
                        }
                });
        }
        render() {
                //const renderComponentMenus = this.state.menus;
                // const states = this.state;
                const redirect = this.state.redirect;
                if (redirect) {
                        // return <Redirect to='/'/>;
                        window.location.href = "http://localhost:3000";
                }
                return (<HashRouter>
                        <div className="container-fluid dashboard-container">
                                <div className="row">
                                        <div className="col-sm-2 col-md-2  side_nav" ref="side_nav">
                                                <ul>
                                                        <li><img src={userphoto} alt="logo" className="img-fluid user_photo menu" /><span>{this.state.loggedUserName}</span></li>
                                                        {this.getMenuData()}
                                                        <li className="menu addnew" data-menu="addnew" onClick={((e) => this.handleAddNew(e))} id="newlist" ref="newlist"><i className="fa fa-plus" aria-hidden="true"></i><span className="d-none d-md-block">New List</span></li>
                                                        <li className="addlist hide" >
                                                                <div className="input-group mb-3">
                                                                        <input type="text" className="form-control" id="addNewListName" onClick={((e) => this.handleAddNew(e))} ref='addNewListName' />
                                                                        <div className="input-group-append addNewList" onClick={((e) => this.handleAddNew(e))}>
                                                                                <span className="input-group-text addNewList" id="basic-addon2"><i className="fa fa-plus addNewList" aria-hidden="true"></i></span>
                                                                        </div>
                                                                </div>
                                                        </li>
                                                </ul>
                                        </div>
                                        <div className="col-sm-10 col-md-10  content">
                                                <div className="top_bg_image">
                                                        <div className="logout_section">
                                                                <a onClick={() => this.handleClickLogout()}>LOGOUT</a>
                                                        </div>
                                                        <div className="menu_bar d-none d-sm-block d-md-none d-block d-sm-none" ref="menu_bar">
                                                                <span onClick={((e) => this.handleShowSideMenu(e))} data-display="show" ref="menu_icon"><i className="fa fa-bars" aria-hidden="true"></i></span>
                                                        </div>
                                                        <div className="img_head">
                                                                <h1 >My ToDo</h1>
                                                                <p id="display_datetime"> {this.getCurrentTime()}</p>
                                                        </div>
                                                </div>
                                                <div className="bottom_content">
                                                        <Route path="/dashboard" render={(props) => <DashboardContent {...props} states={this.state} />} />
                                                        <Route path="/myday" render={(props) => <MyDay {...props} states={this.state} />} />
                                                        <Route path="/todo" render={(props) => <ToDo {...props} states={this.state} />} />
                                                        <Switch>
                                                                {this.handleDynamicComponent()}
                                                        </Switch>
                                                </div>
                                                <UsersChatComponent states={this.state} />
                                        </div>
                                </div>
                                <div className="modal" id="modalTask" role="dialog" ref="modalTask">
                                        <div className="modal-dialog modal-md">
                                                <div className="modal-content">
                                                        <div className="modal-header">
                                                                <h5> <span id="show_task_type" ref="showTaskType"></span></h5>
                                                                <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.handleClickCloseModal()}>
                                                                        <span aria-hidden="true">×</span>
                                                                </button>
                                                        </div>
                                                        <div className="modal-body">
                                                                <form >
                                                                        <div className="form-group">
                                                                                <label><span id="task_action" ref="task_action"></span> Task</label>
                                                                                <input type="text" className="form-control" ref="task_name" name="task_name" id="task_name" onChange={(e) => this.handleCheckInput(e)} />
                                                                                <span className="error hide">Enter valid Task min 10 chars</span>
                                                                        </div>
                                                                        <div className="form-group">
                                                                                <label>Due Date</label>
                                                                                <DatePicker className="form-control" minDate={new
                                                                                        Date()} maxDate={new Date(endOfWeek)}
                                                                                        selected={this.state.dueDate}
                                                                                        onChange={this.handleChange} ref="due_date"
                                                                                />
                                                                                <span className="error hide">Please Select Date</span>
                                                                        </div>
                                                                        <div className="form-group">
                                                                                <label>Priority</label>
                                                                                <select className="form-control" ref="task_priority" id="task_priority" onChange={(e) => this.handleCheckInput(e)}>
                                                                                        <option value="">Select</option>
                                                                                        <option value="1">Low</option>
                                                                                        <option value="2">Medium</option>
                                                                                        <option value="3">High</option>
                                                                                </select>
                                                                                <span className="error hide">Please Select Priority</span>
                                                                        </div>
                                                                        <input type="hidden" id="task_type" name="task_type" ref="task_type" />
                                                                        <input type="hidden" id="edit_index" name="edit_index" ref="edit_index" />
                                                                        <input type="hidden" id="edit_row" name="edit_row" ref="edit_row" />
                                                                        <button type="button" className="btn btn-primary" id="btn-task" onClick={() => this.handleSubmitTask()}>Submit</button>
                                                                </form>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                                <div className="modal" id="modalDeleteTask" role="dialog" ref="modalDeleteTask">
                                        <div className="modal-dialog modal-md">
                                                <div className="modal-content">
                                                        <div className="modal-header">
                                                                <h5> Delete?</h5>
                                                                <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.handleClickCloseModal()}>
                                                                        <span aria-hidden="true">×</span>
                                                                </button>
                                                        </div>
                                                        <div className="modal-body">
                                                                <p>Are you sure want to Delete?</p>
                                                                <div className="offset-md-3  col-md-9  col-sm-12">
                                                                        <div className="row">
                                                                                <input type="hidden" id="delete_task_type" name="delete_task_type" ref="delete_task_type" />
                                                                                <input type="hidden" id="delete_task_index" name="delete_task_index" ref="delete_task_index" />
                                                                                <input type="hidden" id="delete_task_row" name="delete_task_row" ref="delete_task_row" value="0" />
                                                                                <div className="col-md-6 ">
                                                                                        <button type="button" className="btn btn-info btn-cancel" onClick={() => this.handleClickCloseModal()}>Cancel</button>
                                                                                </div>
                                                                                <div className="col-md-6 ">
                                                                                        <button type="button" className="btn btn-primary btn-delete" onClick={() => this.handleTaskDelete()}>Delete</button>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </HashRouter>)
        }
}
export default Dashboard;