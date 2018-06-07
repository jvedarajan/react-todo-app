import React from 'react';
//import {Route, NavLink, HashRouter} from "react-router-dom";
//import {Route,IndexRoute,browserHistory} from 'react-router';
//import { createHashHistory } from 'history'
//import { createStore, combineReducers, applyMiddleware } from 'redux';
//import { routerMiddleware, push } from 'react-router-redux'
import applogo from '../images/Todo-Pollo-logo.png';
import userMenus from '../jsons/usermenus.json';
import RegisterForm from "./RegisterForm";
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
    const checkEmailVal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let flag;
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
      let usersRow, userRowIndex;
     // var userInfoObj = { "userEmail": email, "userPassword": password, "loginStatus": 1, userMenus };
      if (userInformation !== null && userInformation !== undefined) {
        usersRow = userInformation.users;
        userRowIndex = usersRow.map(function (e) { return e.userEmail; }).indexOf(email);
        if (userRowIndex === -1) {
         /* usersRow.push(userInfoObj);
          localStorage.setItem('userInfo', JSON.stringify(userInformation));*/
         this.refs.reg_error.classList.remove('hide');
        } else {
          this.refs.reg_error.classList.add('hide');
          if (usersRow[userRowIndex].userPassword !== password) {
            pwdElement.classList.add('invalid');
            pwdElement.nextElementSibling.classList.remove('hide');
            pwdElement.nextElementSibling.innerHTML = "Invalid Password";
          } else {
            localStorage.setItem('loggedUser', email);
            localStorage.setItem('userRow', userRowIndex);
            this.props.history.push('/dashboard');
            window.location.reload();
          }
        }
      }else{
        this.refs.reg_error.classList.remove('hide');
      } /*else {
        var users = [];
        users.push(userInfoObj);
       const createNewObj = { "users": users };
        localStorage.setItem('userInfo', JSON.stringify(createNewObj));
        this.props.history.push('/dashboard');
        userRowIndex = 0;
      }
      localStorage.setItem('loggedUser', email);
      localStorage.setItem('userRow', userRowIndex);*/
    }
  }
  handleClickRegister = () => {
    const formDiv = this.refs.loginBlock;
    formDiv.style.display = "none";
    const regBlock = this.refs.registerBlock;
    regBlock.style.display = "block";
  }
  render() {
    return (
      <div className="container-fluid login-container">
        <div className="row">
          <div className="col-sm-12 col-md-4 offset-md-4  login-banner">
            <div className="logo"> <img src={applogo} className="img-fluid justify-content-center app_logo" alt="logo" /></div>
            <div ref="loginBlock" id="login_block">
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
              <p className="register_new_error hide error" ref="reg_error">Email Not Found Please Register</p>
              <p className="register_link"><span>New User?</span><span onClick={this.handleClickRegister.bind(this)}>Register</span></p>
            </div>
            <div ref="registerBlock" id="register_block">
                <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login;
