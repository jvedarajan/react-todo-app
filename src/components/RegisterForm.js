import React, { Component } from "react";
import axios from 'axios';
//import userMenusJSON from '../jsons/usermenus.json';
class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = { reg_email: "", reg_password: "", first_name: "", last_name: "", default_menus: "" };
    }
    getCurrentTime = () => {
        const today = new Date();
        const h = this.checkTime(today.getHours());
        const m = this.checkTime(today.getMinutes());
        const s = this.checkTime(today.getSeconds());
        const date = this.checkTime(today.getDate());
        const month = this.checkTime(today.getMonth());
        const year = today.getFullYear();
        const currentDateTime = year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
        return currentDateTime;
    }
    checkTime = i => {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    componentDidMount = () => {
        const _this = this;
        axios.get('https://api.myjson.com/bins/a4qpm')
            .then((response) => {
                const sendResponse = response.data;
                _this.setState({ default_menus: sendResponse });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    handleIPChange = (elem) => {
        const elemTarget = elem.target;
        const val = elemTarget.value;
        this.setState({ [elemTarget.name]: elemTarget.value });
        if (val !== '') {
            elemTarget.classList.remove('invalid');
            elemTarget.nextElementSibling.classList.add('hide');
            const getID = elemTarget.getAttribute("id");
            const checkEmailVal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (getID === "reg_email") {
                if (!checkEmailVal.test(val)) {
                    elemTarget.classList.add('invalid');
                    elemTarget.nextElementSibling.classList.remove('hide');
                } else {
                    //const checkCurrentUserEmail = this.validateRegEmail(val);
                    //  this.callValidateEmailApi(val, elemTarget);
                }
            }
        }
    }
    validateRegEmail = (email) => {
        const localStorageItems = localStorage.getItem('userInfo');
        let flag = true;
        if (localStorageItems !== undefined && localStorageItems !== null) {
            const userInformation = JSON.parse(localStorage.getItem('userInfo'));
            const users = userInformation.users;
            const findUserRowIndex = users.map((e) => { return e.userEmail; }).indexOf(email);
            if (findUserRowIndex > -1) {
                flag = false;
            }
        }
        return flag;
    }
    handleRegisterSubmit = () => {
        const email = this.state.reg_email.trim();
        const password = this.state.reg_password.trim();
        const fname = this.state.first_name.trim();
        const lname = this.state.last_name.trim();
        const emailElement = this.refs.reg_email;
        const pwdElement = this.refs.reg_password;
        const fnameElement = this.refs.first_name;
        const lnameElement = this.refs.last_name;
        let flagSet = false;
        if (password === "" && password.length < 6) {
            pwdElement.classList.add('invalid');
            pwdElement.nextElementSibling.classList.remove('hide');
        } else {
            pwdElement.classList.remove('invalid');
            pwdElement.nextElementSibling.classList.add('hide');
        }
        if (fname === "" && fname.length < 6) {
            fnameElement.classList.add('invalid');
            fnameElement.nextElementSibling.classList.remove('hide');
        } else {
            fnameElement.classList.remove('invalid');
            fnameElement.nextElementSibling.classList.add('hide');
        }
        if (lname === "") {
            lnameElement.classList.add('invalid');
            lnameElement.nextElementSibling.classList.remove('hide');
        } else {
            lnameElement.classList.remove('invalid');
            lnameElement.nextElementSibling.classList.add('hide');
        }
        if (email === "") {
            emailElement.classList.add('invalid');
            emailElement.nextElementSibling.classList.remove('hide');
        } else {
            emailElement.classList.remove('invalid');
            emailElement.nextElementSibling.classList.add('hide');
        }
        if (password !== "" && password.length >= 6 && fname !== "" && fname.length >= 3 && lname !== "" && email !== "") {
            flagSet = true;
        }
        if (flagSet) {
            this.callRegisterApi();
        }
    }
    callValidateEmailApi = async (email, elemTarget) => {
        const response = await fetch('/api/validateEmail',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: email
                }),
                headers: { "Content-Type": "application/json" }
            });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        const regBtn = this.refs.btn_register;
        if (body.status === "ERR") {
            elemTarget.classList.add('invalid');
            elemTarget.nextElementSibling.classList.remove('hide');
            elemTarget.nextElementSibling.innerHTML = "This Email is already Registered";
            regBtn.classList.add('disabled');
        }
        else {
            elemTarget.nextElementSibling.innerHTML = "Please Enter Valid Email";
            regBtn.classList.remove('disabled');
        }
    }
    callRegisterApi = async () => {
        const email = this.state.reg_email;
        const password = this.state.reg_password;
        const fname = this.state.first_name;
        const lname = this.state.last_name;
        const pretime = this.getCurrentTime();
        const response = await fetch('/api/register',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstname: fname,
                    lastname: lname,
                    created_at: pretime
                }),
                headers: { "Content-Type": "application/json" }
            });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.status === "OK" && body.error === false) {
            alert("Registered Successfully");
            window.location.reload();
        } else {
            alert("Try different Email");
        }
    }

    render() {
        return (
            <form>
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" id="first_name" ref="first_name" name="first_name" onBlur={((e) => this.handleIPChange(e))} />
                    <span className="error hide">Please Enter First Name </span>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" className="form-control" id="last_name" ref="last_name" name="last_name" onBlur={((e) => this.handleIPChange(e))} />
                    <span className="error hide">Please Enter Last Name </span>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" id="reg_email" ref="reg_email" name="reg_email" onBlur={((e) => this.handleIPChange(e))} />
                    <span className="error hide">Please Enter Valid Email </span>
                </div>
                <div className="form-group">
                    <label>Create Password</label>
                    <input type="password" className="form-control" name="reg_password" ref="reg_password" id="reg_password" onBlur={((e) => this.handleIPChange(e))} />
                    <span className="error hide">Please Enter Valid Password </span>
                </div>
                <button type="button" className="btn btn-default btn-register" onClick={this.handleRegisterSubmit.bind(this)} ref="btn_register">Register</button>
            </form>
        );
    }
}
export default RegisterForm;