import React, { Component } from "react";
import userMenus from '../jsons/usermenus.json';
class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = { reg_email: "", reg_password: "",first_name:"",last_name:"" };
    }
    handleIPChange = (elem) =>{
        const elemTarget = elem.target;
        const val = elemTarget.value;
        this.setState({[elemTarget.name]: elemTarget.value});
        if (val !== '') {
            elemTarget.classList.remove('invalid');
            elemTarget.nextElementSibling.classList.add('hide');
           const getID =  elemTarget.getAttribute("id");
           const checkEmailVal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(getID==="reg_email"){
                if (!checkEmailVal.test(val)) {
                    elemTarget.classList.add('invalid');
                    elemTarget.nextElementSibling.classList.remove('hide');
                }else{
                    const checkCurrentUserEmail = this.validateRegEmail(val);
                    const regBtn = this.refs.btn_register;
                    if(!checkCurrentUserEmail){
                        elemTarget.classList.add('invalid');
                        elemTarget.nextElementSibling.classList.remove('hide');
                        elemTarget.nextElementSibling.innerHTML = "This Email is already Registered";
                        regBtn.classList.add('disabled');
                    }else{
                        elemTarget.nextElementSibling.innerHTML = "Please Enter Valid Email";
                        regBtn.classList.remove('disabled');
                    }
                }
            }
        }
    }
    validateRegEmail = (email)=>{
        const localStorageItems = localStorage.getItem('userInfo');
        let flag = true;
        if (localStorageItems !== undefined && localStorageItems!==null) {
            const userInformation = JSON.parse(localStorage.getItem('userInfo'));
            const users = userInformation.users;
           const findUserRowIndex = users.map(function (e) { return e.userEmail; }).indexOf(email);
            if(findUserRowIndex>-1){
                flag =false;
            }
        }
        return flag;
    }
    handleRegisterSubmit = ()=>{
        const email     = this.state.reg_email;
        const password  = this.state.reg_password;
        const fname     = this.state.first_name;
        const lname     = this.state.last_name;
        const emailElement = this.refs.reg_email;
        const pwdElement = this.refs.reg_password;
        const fnameElement = this.refs.first_name;
        const lnameElement = this.refs.last_name;
        var flagSet = true;
        console.log(fname);
        if(password==="" && password.length<6){
            pwdElement.classList.add('invalid');
            pwdElement.nextElementSibling.classList.remove('hide');
            flagSet = false;
        }else{
            pwdElement.classList.remove('invalid');
            pwdElement.nextElementSibling.classList.add('hide');
            flagSet = true;
        }
        if(fname==="" && fname.length<6){
            fnameElement.classList.add('invalid');
            fnameElement.nextElementSibling.classList.remove('hide');
            flagSet = false;
        }else{
            fnameElement.classList.remove('invalid');
            fnameElement.nextElementSibling.classList.add('hide');
            flagSet = true;
        }
        if(lname===""){
            lnameElement.classList.add('invalid');
            lnameElement.nextElementSibling.classList.remove('hide');
            flagSet = false;
        }else{
            lnameElement.classList.remove('invalid');
            lnameElement.nextElementSibling.classList.add('hide');
            flagSet = true;
        }
        if(email===""){
            emailElement.classList.add('invalid');
            emailElement.nextElementSibling.classList.remove('hide');
            flagSet = false;
        }else{
            emailElement.classList.remove('invalid');
            emailElement.nextElementSibling.classList.add('hide');
            flagSet = true;
        }
        if(flagSet){
            const userInfoObj = {"userName":fname+" "+lname, "userEmail": email, "userPassword": password, "loginStatus": 0, userMenus };
            const localStorageItems = localStorage.getItem('userInfo');
            if (localStorageItems !== undefined && localStorageItems!==null) {
                const userInformation = JSON.parse(localStorage.getItem('userInfo'));
                const users = userInformation.users;
                 users.push(userInfoObj);
              localStorage.setItem('userInfo', JSON.stringify(userInformation));
            }else{
             const allUsers = [];
              allUsers.push(userInfoObj);
                const createNewObj = { "users": allUsers };
               localStorage.setItem('userInfo', JSON.stringify(createNewObj));
            }
            window.location.reload();
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