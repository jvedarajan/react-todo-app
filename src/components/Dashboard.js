import React from 'react';
import userphoto from '../images/user_icon.png';
import { Route, BrowserRouter as HashRouter, NavLink, Switch, Router } from 'react-router-dom';
//import { Redirect } from 'react-router'
import DashboardContent from "./DashboardContent";
import MyDay from "./MyDay";
import ToDo from "./ToDo";
import TasksComponent from "./TasksComponent";
document.onclick = function () {
        const thisElement = document.getElementById("newlist");
        if (thisElement) {
                thisElement.classList.remove('hide');
                thisElement.nextSibling.classList.add('hide');
        }
}
const newListAdded = [];
class Dashboard extends React.Component {
        constructor(props){
                super(props);
                const propsVals = this.props.states;
                this.state = { datetime: this.getCurrentTime(),datetime2: this.getCurrentTime('db'), menus: propsVals.menus, userRowIndex: propsVals.userRowIndex, allUsersInfo: propsVals.allUsersInfo, loggedUser: propsVals.loggedUser, loggedUserName: propsVals.loggedUserName };
              } 
        state = {};
        componentWillMount  =() =>{ 
                const propsVals = this.props.states;
                // this.getCustomTasks();
                this.callApigetCustomMenus(propsVals.userRowIndex);
                //this.getTime();
        }
        getCustomTasks = () => {
                const getMenus = this.state.menus;
                Object.keys(getMenus).map(function (menuObject, ind) {
                        if (getMenus[menuObject].type === 'custom') {
                                newListAdded.push({ "path": "/" + getMenus[menuObject].menuname.toLowerCase(), "component": "TasksComponent", "task": getMenus[menuObject].menuname });
                        }
                });
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
                const month = this.checkTime(today.getMonth()+1);
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
                        const displaydatetime = months[Math.round(month)-1] + " " + date + ", " + year + "  " + h + ":" + m + "  " + setPeriod;
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
                const userMenusArr = Object.keys(userMenus).map(function (i) {
                        return userMenus[i];
                });
                return userMenusArr.map(menus => {
                        const listsLength = menus.added_lists.length;
                        let countShow;
                        if (listsLength === 0) {
                                countShow = '';
                        } else {
                                countShow = listsLength;
                        }
                        return <li key={menus.display_order} className="menu" data-menu={menus.menuname} data-display={menus.display_order}><i className={menus.iconclass} aria-hidden="true"></i>   <NavLink to={menus.path}><span className="menu_itemname">{menus.menuname}</span> <span className="menu_itemcount">{countShow}</span></NavLink></li>;
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
                //  const userInformation = this.state.allUsersInfo;
                const menusRow = menus[taskTodo];
                if (taskName !== "" && taskName.length > 10) {
                        taskIPElem.classList.remove('invalid');
                        taskIPElem.nextElementSibling.classList.add('hide');
                        if (menusRow.menuname === taskTodo) {
                                if (taskAction === "Edit") {
                                        menusRow.added_lists[taskIndex].title = taskName;
                                }
                                if (taskAction === "Add") {
                                        const createNewTask = { title: taskName, created_at: this.getCurrentTime(), status: "pending", completed_at: "" };
                                        menusRow.added_lists.push(createNewTask);
                                }
                        }
                        // localStorage.setItem('userInfo', JSON.stringify(userInformation));
                        this.callApiAddEditTodo(taskTodo, taskName,taskAction,taskRow);
                        this.setState({ menus: menus });
                        //   this.handleClickCloseModal();
                } else {
                        taskIPElem.classList.add('invalid');
                        taskIPElem.nextElementSibling.classList.remove('hide');
                }
        }
        handleCheckInput = (event) => {
                const taskInput = this.refs.task_name;
                const taskInputVal = taskInput.value;
                if (taskInputVal === "") {
                        taskInput.classList.add('invalid');
                        taskInput.nextElementSibling.classList.remove('hide');
                } else {
                        taskInput.classList.remove('invalid');
                        taskInput.nextElementSibling.classList.add('hide');
                }
        }
        handleTaskDelete = () => {
                const taskType = this.refs.delete_task_type.value;
                const deleteIndex = this.refs.delete_task_index.value;
                const deleteRow = this.refs.delete_task_row.value;
               const menus = this.state.menus;
               // const userInformation = this.state.allUsersInfo;
                                var lists = menus[taskType].added_lists;
                                var newArr = [];
                                for (var i = 0; i < lists.length; i++) {
                                        if (i !== deleteIndex) {
                                                newArr.push(lists[i]);
                                        }
                                }
                                delete menus[taskType].added_lists;
                                menus[taskType].added_lists = newArr;
             //   localStorage.setItem('userInfo', JSON.stringify(userInformation));
                this.callApiDeleteTodo(taskType,deleteRow,deleteIndex);  
                this.setState({ menus: menus });
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
                }
                this.callApiGetTodoLists();
        }
        callApiAddEditTodo = async (taskTodo, taskName,taskAction,editID) => {
                const _this = this;
                const response = await fetch('/api/addEditTodo',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: _this.state.userRowIndex,
                                        taskTodo: taskTodo,
                                        taskName: taskName,
                                        taskAction:taskAction,
                                        created_at: _this.getCurrentTime('dbdateformat'),
                                        editID:editID
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        _this.handleClickCloseModal();
                        if(taskAction==="Add"){
                               _this.refs.edit_row = body.data ;
                               _this.refs.delete_task_row = body.data ;
                        }
                      
                }
        }
        callApiDeleteTodo = async (taskTodo,rowId,deleteIndex) => {
                const _this = this;
                const response = await fetch('/api/deleteTodo',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        user: _this.state.userRowIndex,
                                        taskTodo: taskTodo,
                                        rowId:rowId
                                }),
                                headers: { "Content-Type": "application/json" }
                        });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                        _this.handleClickCloseModal();
                                 
                }
        }
        callApiGetTodoLists = async () => {
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
                                let status = todos.todo_status;
                                if (status === 0) {
                                    status = "pending";
                                }else if(status===1){
                                        status = "completed";    
                                }
                                const addTodoListObj = { "status": status, "title": todos.todo_name, "task": todos.todo_type, "created_at": todos.created_at,"id":todos.id,"completed_at": todos.completed_at };
                                userTodos[getTodoType].added_lists.push(addTodoListObj);
                        });
                        _this.setState({ menus: userTodos });
                }
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
                                                        <Route path="/groceries" render={(props) => <TasksComponent {...props} states={this.state} taskType='Groceries' />} />
                                                        <Route path="/work" render={(props) => <TasksComponent {...props} states={this.state} taskType='Work' />} />
                                                        <Route path="/watchmovies" render={(props) => <TasksComponent {...props} states={this.state} taskType='Movies To Watch' />} />
                                                        <Route path="/family" render={(props) => <TasksComponent {...props} states={this.state} taskType='Family' />} />
                                                        <Route path="/travel" render={(props) => <TasksComponent {...props} states={this.state} taskType='Travel' />} />
                                                        <Switch>
                                                                {newListAdded.map(route => (
                                                                        <Route key={route.path} path={route.path} render={(props) => <TasksComponent {...props} states={this.state} taskType={route.task} />} />
                                                                ))}
                                                        </Switch>
                                                </div>
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