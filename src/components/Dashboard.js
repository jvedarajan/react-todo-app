import React from 'react';
import userphoto from '../images/user_icon.png';
import { Route, BrowserRouter as HashRouter, NavLink, Switch } from 'react-router-dom';
import DashboardContent from "./DashboardContent";
import MyDay from "./MyDay";
import ToDo from "./ToDo";
import TasksComponent from "./TasksComponent";
import ModalAddTask from "./ModalAddTask";
import ModalDeleteTask from "./ModalDeleteTask";
//import UsersChatComponent from "./UsersChatComponent";

import moment from 'moment';

class Dashboard extends React.Component {
        constructor(props) {
                super(props);
                const propsVals = this.props.states;
                this.state = { "newListAdded": [], dueDate: moment(), datetime: this.getCurrentTime(), datetime2: this.getCurrentTime('db'), menus: propsVals.menus, userRowIndex: propsVals.userRowIndex, allUsersInfo: propsVals.allUsersInfo, loggedUser: propsVals.loggedUser, loggedUserName: propsVals.loggedUserName, newListIPVisible: false, tasksCount: 0 };
                this.handleChange = this.handleChange.bind(this);
                this.passRefs = React.createRef();
                this.handleClick = this.handleClick.bind(this);
                this.handleOutsideClick = this.handleOutsideClick.bind(this);
                this.handleStateUpdateNewTask = this.handleStateUpdateNewTask.bind(this);
                this.handleStateDeleteTask = this.callApiGetTodoLists.bind(this);
        }

        componentDidMount = () => {
                const propsVals = this.props.states;
                this.callApigetCustomMenus(propsVals.userRowIndex);
        }

        componentWillReceiveProps = (nextprops) => {
                this.setState({ menus: nextprops.menus });
                this.forceUpdate();
        }

        handleStateUpdateNewTask(newMenus) {
                //   e.preventDefault();
                this.setState({ menus: newMenus })
        }

        handleClick() {
                if (!this.state.newListIPVisible) {
                        document.addEventListener('click', this.handleOutsideClick, false);
                } else {
                        document.removeEventListener('click', this.handleOutsideClick, false);
                }
                this.setState({
                        newListIPVisible: !this.state.newListIPVisible,
                });
        }

        handleOutsideClick(e) {
                if (this.node.contains(e.target)) {
                        return;
                }
                this.handleClick();
        }


        handleChange = (date) => {
                this.setState({
                        dueDate: date
                });
        }

        getCustomTasks = () => {
                const newListAdded = [];
                const getMenus = this.state.menus;
                Object.keys(getMenus).map((menuObject, ind) => {
                        if (getMenus[menuObject].type === 'custom') {
                                newListAdded.push({ "path": "/" + getMenus[menuObject].menuname.toLowerCase(), "component": "TasksComponent", "task": getMenus[menuObject].menuname });
                        }
                });
                this.setState({ newListAdded: newListAdded });
                return;
        }

        getTime = () => {
                this.setState({ datetime: this.getCurrentTime() });
                setTimeout(this.getTime.bind(this), 30000);
        }

        getCurrentTime = (passdb) => {
                const today = new Date();
                let currentDateTime = '';
                if (passdb) {
                        currentDateTime = moment(today).format('YYYY-MM-DD h:m:s');
                } else {
                        currentDateTime = moment(today).format('lll');
                }
                return currentDateTime;
        }


        hasClass = (element, cls) => {
                const returnFlag = (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
                return returnFlag;
        }

        /* Display List of Menu Items*/
        getMenuData = () => {
                const userMenus = this.state.menus;
                return Object.keys(userMenus).map((menus, i) => {
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
                const target = e.target || e.srcElement;
                const checkClickAddNew = this.hasClass(target, 'addNewList');
                if (checkClickAddNew) {
                        const newList = this.refs.addNewListName.value.trim();
                        if (newList !== '') {
                                this.callApiAddMenuTask(newList);
                        }
                } else {
                        this.refs.addNewListName.value = '';
                }
        }

        handleClickLogout = () => {
                localStorage.removeItem('loggedUserID');
                localStorage.removeItem('loggedUserName');
                this.props.history.push('/');
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
        callApiAddMenuTask = async (newMenuName) => {
                const _this = this;
                const userMenus = _this.state.menus;
                const displayOrder = Object.keys(userMenus).length + 1;
                const setPath = "/" + newMenuName.toLowerCase();
                const response = await fetch('/api/addMenu',
                        {
                                method: 'POST',
                                body: JSON.stringify({
                                        menuname: newMenuName,
                                        path: setPath,
                                        user_id: _this.state.userRowIndex,
                                        menu_display_order: displayOrder,
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
                        this.setState({
                                newListIPVisible: !this.state.newListIPVisible,
                        });
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
                        _this.setState({ tasksCount: getTodoLists.length }) ;
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
                                const addTodoListObj = { "status": status, "title": todos.todo_name, "task": todos.todo_type, "created_at": todos.created_at, "id": todos._id, "completed_at": todos.completed_at, "due_date": todos.due_date, "priority": todos.todo_priority };
                                userTodos[getTodoType].added_lists.push(addTodoListObj);
                        });
                        _this.setState({ menus: userTodos });
                }
        }

        handleDynamicComponent = () => {
                const getMenus = this.state.menus;
                const _this = this;
                return Object.keys(getMenus).map((menuObject, ind) => {
                        if (getMenus[menuObject].menuname !== 'To-Do' && getMenus[menuObject].menuname !== "My-Day" && getMenus[menuObject].menuname !== "Dashboard") {
                                return <Route key={getMenus[menuObject].path} path={getMenus[menuObject].path} render={(props) => <TasksComponent  {...props} states={_this.state} passrefs={_this.passRefs} taskType={getMenus[menuObject].menuname} />} />
                        }
                });
        }

        render() {
                const redirect = this.state.redirect;
                if (redirect) {
                        window.location.href = "http://localhost:3000";
                }
                return (<HashRouter>
                        <div className="container-fluid dashboard-container">
                                <div className="row">
                                        <div className="col-sm-2 col-md-2  side_nav" ref="side_nav">
                                                <ul>
                                                        <li><img src={userphoto} alt="logo" className="img-fluid user_photo menu" /><span>{this.state.loggedUserName}</span></li>
                                                        {this.getMenuData()}
                                                        {!this.state.newListIPVisible && (
                                                                <li className="menu addnew" data-menu="addnew" onClick={this.handleClick} id="newlist" ref="newlist"><i className="fa fa-plus" aria-hidden="true"></i><span className="d-none d-md-block">New List</span></li>
                                                        )}
                                                        {this.state.newListIPVisible && (
                                                                <li className="addlist" ref={node => { this.node = node; }}>
                                                                        <div className="input-group mb-3">
                                                                                <input type="text" className="form-control" id="addNewListName" ref='addNewListName' />
                                                                                <div className="input-group-append addNewList" onClick={((e) => this.handleAddNew(e))}>
                                                                                        <span className="input-group-text addNewList" id="basic-addon2"><i className="fa fa-plus addNewList" aria-hidden="true"></i></span>
                                                                                </div>
                                                                        </div>
                                                                </li>
                                                        )}
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
                                        </div>
                                </div>
                                <ModalAddTask menus={this.state.menus} handleStateUpdateNewTask={this.handleStateUpdateNewTask} />
                                <ModalDeleteTask menus={this.state.menus} handleStateDeleteTask={this.callApiGetTodoLists} />
                        </div>
                </HashRouter>)
        }
}
export default Dashboard;