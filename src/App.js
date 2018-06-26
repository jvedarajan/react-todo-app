import React, { Component } from 'react';
//import ReactDom from 'react-dom';
import { Route } from 'react-router';
//import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
//import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-react-router';
//import logo from './logo.svg';
//import './App.css';
//import {store,history} from './store';
//import { Redirect } from 'react-router'
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/font.lato.css';
import './css/style.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import userMenus from './jsons/usermenus.json';
class App extends Component {
  constructor() {
    super();
    this.state = { menus: "" };
    //this.checkUserLogin();
    const loggedUserEmail = localStorage.getItem('loggedUser');
    if (loggedUserEmail !== undefined && loggedUserEmail !== null && loggedUserEmail !== '') {
      // const userInformation = JSON.parse(localStorage.getItem('userInfo'));
      /* if (userInformation !== null && userInformation !== undefined) {
              const userRowIndex = localStorage.getItem('userRow');
               const usersRow = userInformation.users;
               const userMenusStorage = usersRow[userRowIndex].userMenus;
               const userName = usersRow[userRowIndex].userName;
              this.state = {redirect: false, menus: userMenusStorage, userRowIndex: userRowIndex, allUsersInfo: userInformation, loggedUser: loggedUserEmail,loggedUserName:userName };
       }else{
              this.setState({ redirect: true,menus:{} });  
       }   */
      const userDefaultMenus = userMenus;
      const userName = localStorage.getItem('loggedUserName');
      const userRowID = localStorage.getItem('loggedUserID');
      this.state = { redirect: false, menus: userDefaultMenus, userRowIndex: userRowID, allUsersInfo: "", loggedUser: loggedUserEmail, loggedUserName: userName };
    } else {
      this.setState({ redirect: true, menus: {} });
    }
  }
  componentDidMount = () => {
    this.callApigetCustomMenus(this.state.userRowIndex);
    const userName = localStorage.getItem('loggedUserName');
    const userRowID = localStorage.getItem('loggedUserID');
    if (userName === undefined || userName === null || userRowID === undefined || userRowID === null) {
      const url = window.location;
      if (url.pathname !== "/") {
         window.location.href = "http://localhost:3000";
      }
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
  }
  render() {
    const _this = this;
    // const redirect = _this.state.redirect;
    const userMenusStorages = _this.state.menus;
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          {Object.keys(userMenusStorages).map(function (menuObj, ind) {
            return (<Route key={ind} path={userMenusStorages[menuObj].path} render={(props) => <Dashboard {...props} states={_this.state} />} />);
          })
          }
        </Switch>
      </Router>
    );
  }
}

export default App;
