import React from 'react';
import userphoto from '../images/user_icon.png';
import {  Route, BrowserRouter as HashRouter, NavLink,Switch } from 'react-router-dom';
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
        constructor(props) {
                super();
                var loggedUserEmail = localStorage.getItem('loggedUser');
               var  userRowIndex = '';
               this.state = { redirect: false};
               
                if(loggedUserEmail!==undefined && loggedUserEmail!==null && loggedUserEmail!==''){
                const userInformation = JSON.parse(localStorage.getItem('userInfo'));
                if (userInformation !== null && userInformation !== undefined) {
                          userRowIndex = localStorage.getItem('userRow');
                        const usersRow = userInformation.users;
                        var userMenusStorage = usersRow[userRowIndex].userMenus;
                } else {
                        userMenusStorage = '';
                }
                this.state = { datetime: this._loadCurrentTime(), menus: userMenusStorage, userRowIndex: userRowIndex, allUsersInfo: userInformation, loggedUser: loggedUserEmail };
                this._getTime();
                this._loadCustomTasks();
          }else{
                this.setState({ redirect: true });
                window.location.href = "http://localhost:3000";  
          }
        }
        _loadCustomTasks = () =>{
             const getMenus = this.state.menus ;   
             Object.keys(getMenus).map(function (menuObject, ind) {
                if (getMenus[menuObject].type === 'custom') {
                        newListAdded.push({ "path": "/" + getMenus[menuObject].menuname.toLowerCase(),"component": "TasksComponent","task":getMenus[menuObject].menuname});
                  }
                });
        }
        _getTime = () => {
                this.setState({ datetime: this._loadCurrentTime() });
                setTimeout(this._getTime.bind(this), 30000);
        }
        _loadCurrentTime = () => {
                const today = new Date();
                var h = today.getHours();
                var m = today.getMinutes();
                const date = today.getDate();
                const month = today.getMonth();
                const year = today.getFullYear();
                var setPeriod = "AM";
                m = this.checkTime(m);
                if (h > 11) {
                        setPeriod = "PM";
                        if (h !== 12) {
                                h = h - 12;
                        }
                }
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const displaydatetime = months[month] + " " + date + ", " + year + "  " + h + ":" + m + "  " + setPeriod;
                return displaydatetime;
        }
        checkTime=(i)=>{
                if (i < 10) {
                        i = "0" + i;
                }
                return i;
        }
        hasClass = (element, cls)=> {
                const returnFlag = (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
                return returnFlag;
        }
        /* Display List of Menu Items*/
        displayData = () => {
                const userMenus = this.state.menus;
                const userMenusArr = Object.keys(userMenus).map(function (i) {
                        return userMenus[i];
                });
                return userMenusArr.map(menus => {
                        const listsLength = menus.added_lists.length;
                        var countShow;
                        if (listsLength === 0) {
                                countShow = '';
                        } else {
                                countShow = listsLength;
                        }
                        return <li key={menus.display_order} className="menu" data-menu={menus.menuname}><i className={menus.iconclass} aria-hidden="true"></i>   <NavLink to={menus.path}><span className="menu_itemname">{menus.menuname}</span> <span className="menu_itemcount">{countShow}</span></NavLink></li>;
                });
        }
        handleAddNew = (e) => {
                const userRowIndex = this.state.userRowIndex;
                const userMenus = this.state.menus;
                const userInformation = this.state.allUsersInfo;
                const usersRow = this.state.allUsersInfo.users;
                const newlistElement = this.refs.newlist;
                newlistElement.classList.add('hide');
                newlistElement.nextSibling.classList.remove('hide');
                const target = e.target || e.srcElement;
                const checkClickAddNew = this.hasClass(target, 'addNewList');
                if (checkClickAddNew) {
                        const newList = this.refs.addNewListName.value.trim();
                        if (newList !== '') {
                                const key = newList;
                                const createMenuObj = {};
                                const createJSON = {
                                        "menuname": newList, "iconclass": "fa fa-asterisk", "added_lists": [],
                                        "display_order": Object.keys(userMenus).length + 1,
                                        "created_at": this._loadCurrentTime(),
                                        "type": "custom",
                                        "path": "/" + newList.toLowerCase(),
                                        "component": "TasksComponent"
                                };
                                createMenuObj[key] = createJSON;
                                newListAdded.push({ "path": "/" + newList.toLowerCase(),"component": "TasksComponent","task":newList});
                                newlistElement.classList.remove('hide');
                                newlistElement.nextSibling.classList.add('hide');
                                /*   const fs = require('fs');
                                   let data = JSON.stringify(createJSON);  
                                   fs.writeFileSync(userMenus, data);  */
                                const oldMenus = usersRow[userRowIndex].userMenus;
                                const newMenusAdd = Object.assign({}, oldMenus, createMenuObj);
                                delete usersRow[userRowIndex].userMenus;
                                usersRow[userRowIndex].userMenus = newMenusAdd;
                                localStorage.setItem('userInfo', JSON.stringify(userInformation));
                                this.setState({ menus: newMenusAdd });
                                this.displayData();
                        }
                } else {
                        this.refs.addNewListName.value = '';
                }
        }
        taskModalClose = () => {
                const modal = this.refs.modalTask;
                modal.style.display = "none";
                const modal2 = this.refs.modalDeleteTask;
                modal2.style.display = "none";
        }
        submitTask = () => {
                const taskIPElem = this.refs.task_name;
                const taskAction = this.refs.task_action.innerText;
                const taskName = this.refs.task_name.value;
                const taskTodo = this.refs.task_type.value;
                const menus = this.state.menus;
                const userInformation = this.state.allUsersInfo;
                if (taskName !== "" && taskName.length > 10) {
                        taskIPElem.classList.remove('invalid');
                        taskIPElem.nextElementSibling.classList.add('hide');
                        if (taskAction === "Edit") {
                                const taskIndex = this.refs.edit_index.value;
                                for (var a in menus) {
                                        if (menus[a].menuname === taskTodo) {
                                                menus[a].added_lists[taskIndex].title = taskName;
                                                break;
                                        }
                                }
                        }
                        if (taskAction === "Add") {
                                for (var k in menus) {
                                        if (menus[k].menuname === taskTodo) {
                                                var createNewTask = { title: taskName, created_at: this._loadCurrentTime(),status:"pending",completed_at:"" };
                                                menus[k].added_lists.push(createNewTask);
                                                break;
                                        }
                                }
                        }
                        localStorage.setItem('userInfo', JSON.stringify(userInformation));
                        this.setState({ menus: menus });
                        this.taskModalClose();
                } else {
                        taskIPElem.classList.add('invalid');
                        taskIPElem.nextElementSibling.classList.remove('hide');
                }
        }
        componentAdd = () => {
                const currentStates = this.state;
                const componentMenus = currentStates.menus;
                return Object.keys(componentMenus).map(function (menuObj, ind) {
                        if (componentMenus[menuObj].menuname !== '') {
                                var Component = componentMenus[menuObj].component;
                                if (Component === "DashboardComponent") {
                                        Component = "DashboardContent";
                                }
                                return (<Route key={ind} path={componentMenus[menuObj].path} render={(props) => <Component {...props} states={currentStates} />} />);
                        }
                });
        }
        checkInput = (event) => {
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
        taskDelete = () =>{
                const taskType = this.refs.delete_task_type.value;
                const deleteIndex = this.refs.delete_task_index.value;
                const menus = this.state.menus;
                const userInformation = this.state.allUsersInfo;
                for (var a in menus) {
                        if (menus[a].menuname === taskType) {
                                var lists = menus[a].added_lists ;
                                var newArr = [] ;
                                for(var i=0;i<lists.length;i++){
                                   if(i!==deleteIndex){
                                        newArr.push(lists[i]);
                                   } 
                                }
                                delete menus[a].added_lists;
                                menus[a].added_lists = newArr ;
                                break;
                        }
                }
                localStorage.setItem('userInfo', JSON.stringify(userInformation));
                this.setState({ menus: menus });
                this.taskModalClose();
        }
        clickLogout = ()=>{
               ;
                localStorage.removeItem('loggedUser');
                localStorage.removeItem('userRow');
              //  return <Redirect to='/'/>; 
              window.location.href = "http://localhost:3000";
        }
        showSideMenu = (elem) =>{
             const displayType =  this.refs.menu_icon.getAttribute("data-display") ; 
             if(displayType==="show"){
                this.refs.side_nav.style.display = "block";  
                this.refs.menu_bar.style.left = "120px"; 
                this.refs.menu_icon.setAttribute('data-display', 'hide');
             }else{
                this.refs.side_nav.style.display = "none";  
                this.refs.menu_bar.style.left = "10px"; 
                this.refs.menu_icon.setAttribute('data-display', 'show');    
             }
        }
        render() {
                //const renderComponentMenus = this.state.menus;
               // const states = this.state;
                const redirect  = this.state.redirect;
                if (redirect) {
                       // return <Redirect to='/'/>;
                       window.location.href = "http://localhost:3000";       
                }
                return (<HashRouter>
                        <div className="container-fluid dashboard-container">
                                <div className="row">
                                        <div className="col-sm-2 col-md-2 col-lg-2 side_nav" ref="side_nav">
                                                <ul>
                                                        <li><img src={userphoto} alt="logo" className="img-fluid user_photo menu" /><span>{this.state.loggedUser}</span></li>
                                                        {this.displayData()}
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
                                        <div className="col-sm-10 col-md-10 col-lg-10 content">
                                                <div className="top_bg_image">
                                                         <div className="logout_section">
                                                                <a onClick={() => this.clickLogout()}>LOGOUT</a>
                                                        </div>
                                                        <div className="menu_bar d-none d-sm-block d-md-none d-block d-sm-none" ref="menu_bar">
                                                                 <span onClick={((e) => this.showSideMenu(e))} data-display="show" ref="menu_icon"><i className="fa fa-bars" aria-hidden="true"></i></span>
                                                        </div>
                                                        <div className="img_head">
                                                                <h1 >My ToDo</h1>
                                                                <p id="display_datetime"> {this._loadCurrentTime()}</p>
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
                                                                <Route key={route.path}  path={route.path} render={(props) => <TasksComponent {...props} states={this.state} taskType={route.task} />} />
                                                        ))}
                                                        </Switch>
                                                </div>
                                        </div>
                                </div>
                                <div className="modal" id="modalTask" role="dialog" ref="modalTask">
                                        <div className="modal-dialog modal-md">
                                                <div className="modal-content">
                                                        <div className="modal-header">
                                                                <h5> <span id="show_task_type"></span></h5>
                                                                <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.taskModalClose()}>
                                                                        <span aria-hidden="true">×</span>
                                                                </button>
                                                        </div>
                                                        <div className="modal-body">
                                                                <form >
                                                                        <div className="form-group">
                                                                                <label><span id="task_action" ref="task_action"></span> Task</label>
                                                                                <input type="text" className="form-control" ref="task_name" name="task_name" id="task_name" onChange={(e) => this.checkInput(e)} />
                                                                                <span className="error hide">Enter valid Task min 10 chars</span>
                                                                        </div>
                                                                        <input type="hidden" id="task_type" name="task_type" ref="task_type" />
                                                                        <input type="hidden" id="edit_index" name="edit_index" ref="edit_index" />
                                                                        <button type="button" className="btn btn-primary" id="btn-task" onClick={() => this.submitTask()}>Submit</button>
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
                                                                <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.taskModalClose()}>
                                                                        <span aria-hidden="true">×</span>
                                                                </button>
                                                        </div>
                                                        <div className="modal-body">
                                                           <p>Are you sure want to Delete?</p>   
                                                                <div className="offset-md-3 offset-lg-3 colm-md-9 col-lg-9 col-sm-12">
                                                                     <div className="row">
                                                                                <input type="hidden" id="delete_task_type" name="delete_task_type" ref="delete_task_type" />
                                                                                <input type="hidden" id="delete_task_index" name="delete_task_index" ref="delete_task_index" />
                                                                                <div className="col-md-6 col-lg-6">
                                                                                        <button type="button" className="btn btn-info btn-cancel"  onClick={() => this.taskModalClose()}>Cancel</button> 
                                                                                </div>
                                                                                <div className="col-md-6 col-lg-6">
                                                                                        <button type="button" className="btn btn-primary btn-delete"  onClick={() => this.taskDelete()}>Delete</button> 
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