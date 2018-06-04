import React from 'react';
//import {Route, NavLink, HashRouter} from "react-router-dom";
//import {Route,IndexRoute,browserHistory} from 'react-router';
//import { createHashHistory } from 'history'
//import { createStore, combineReducers, applyMiddleware } from 'redux';
//import { routerMiddleware, push } from 'react-router-redux'
import applogo from '../images/Todo-Pollo-logo.png';
//var SHA256 = require("crypto-js/sha256");
import userMenus from '../jsons/usermenus.json';
if (localStorage.getItem('userInfo') !== undefined) {
  var userInformation = JSON.parse(localStorage.getItem('userInfo'));
}
class Login extends React.Component {
  constructor() {
    super();
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('userRow');
    this.state = { email: '', password: '' };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (evt) => {
    const val = evt.target.value;
    this.setState({ [evt.target.name]: evt.target.value });
    if (val !== '') {
      evt.target.classList.remove('invalid');
      evt.target.nextElementSibling.classList.add('hide');
    }
  }
  handleloginSubmit = () => {
    const email = this.state.email;
    const password = this.state.password;
    const emailElement = this.refs.email;
    const pwdElement = this.refs.password;
    var checkEmailVal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var flag;
    if (!checkEmailVal.test(email)) {
      emailElement.classList.add('invalid');
      emailElement.nextElementSibling.classList.remove('hide');
      flag = false;
    } else {
      emailElement.classList.remove('invalid');
      emailElement.nextElementSibling.classList.add('hide');
      flag = true;
    }
    if (password.length < 6) {
      pwdElement.classList.add('invalid');
      pwdElement.nextElementSibling.classList.remove('hide');
      flag = false;
    } else {
      pwdElement.classList.remove('invalid');
      pwdElement.nextElementSibling.classList.add('hide');
      flag = true;
    }
    if (flag === true) {
      var usersRow, userRowIndex;
      var userInfoObj = { "userEmail": email, "userPassword": password, "loginStatus": 1, userMenus };
      if (userInformation !== null && userInformation !== undefined) {
        usersRow = userInformation.users;
        userRowIndex = usersRow.map(function (e) { return e.userEmail; }).indexOf(email);
        if (userRowIndex === -1) {
          usersRow.push(userInfoObj);
          localStorage.setItem('userInfo', JSON.stringify(userInformation));
        } else {
          if (usersRow[userRowIndex].userPassword !== password) {
            pwdElement.classList.add('invalid');
            pwdElement.nextElementSibling.classList.remove('hide');
            pwdElement.nextElementSibling.innerHTML = "Invalid Password";
          } else {
            this.props.history.push('/dashboard');
          }
        }
      } else {
        var users = [];
        users.push(userInfoObj);
        var createNewObj = { "users": users };
        localStorage.setItem('userInfo', JSON.stringify(createNewObj));
        this.props.history.push('/dashboard');
        userRowIndex = 0;
      }
      localStorage.setItem('loggedUser', email);
      localStorage.setItem('userRow', userRowIndex);
    }
  }
  componentWillMount = () => {

  }
  render() {
    return (
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-sm-12 col-md-4 offset-md-4 offset-lg-4 login-banner">
            <div className="logo"> <img src={applogo} className="img-fluid justify-content-center app_logo" alt="logo" /></div>
            <form>
              <div className="form-group">
                <input type="email" className="form-control" id="email" ref="email" name="email" placeholder="Email Address" onBlur={((e) => this.handleChange(e))} />
                <span className="error hide">Please Enter Valid Email </span>
              </div>
              <div className="form-group">
                <input type="password" className="form-control" name="password" ref="password" id="password" placeholder="Password" onBlur={((e) => this.handleChange(e))} />
                <span className="error hide">Please Enter Valid Password </span>
              </div>
              <button type="button" className="btn btn-default btn-login" onClick={this.handleloginSubmit.bind(this)}>Login</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default Login;
