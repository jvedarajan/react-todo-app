import React from 'react';
import applogo from '../images/Todo-Pollo-logo.png';
import RegisterForm from "./RegisterForm";

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
      const getID = evt.target.getAttribute("id");
      if (getID === "email") {
        this.callValidateEmailApi(val, evt.target);
      }
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
      this.callLoginApi(email, password);
      return;
    }
  }

  handleClickRegister = () => {
    const formDiv = this.refs.loginBlock;
    formDiv.style.display = "none";
    const regBlock = this.refs.registerBlock;
    regBlock.style.display = "block";
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
    const logBtn = this.refs.loginBtn;
    if (body.status === "OK") {
      elemTarget.classList.add('invalid');
      elemTarget.nextElementSibling.classList.remove('hide');
      elemTarget.nextElementSibling.innerHTML = "This Email is not available,please register";
      logBtn.classList.add('disabled');
    }
    else {
      logBtn.classList.remove('disabled');
      elemTarget.nextElementSibling.innerHTML = "Please Enter Valid Email";
    }
  }

  callLoginApi = async (email, pwd) => {
    const _this = this;
    const response = await fetch('/api/login',
      {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: pwd
        }),
        headers: { "Content-Type": "application/json" }
      });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    if (body.status === "OK") {
      _this.refs.reg_error.classList.add('hide');
      localStorage.setItem('loggedUser', email);
      localStorage.setItem('loggedUserName', body.data[0].firstname + ' ' + body.data[0].lastname);
      localStorage.setItem('loggedUserID', body.data[0]._id);
      _this.props.history.push('/dashboard');
      window.location.reload();
    } else {
      _this.refs.reg_error.classList.remove('hide');
      _this.refs.reg_error.innerHTML = body.message;
    }
  }

  componentDidMount = () => {

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
                <button type="button" className="btn btn-default btn-login" ref="loginBtn" onClick={this.handleloginSubmit.bind(this)}>Login</button>
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
