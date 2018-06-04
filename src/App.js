import React, { Component } from 'react';
//import ReactDom from 'react-dom';
import {Route} from 'react-router';
//import { Provider } from 'react-redux';
import { BrowserRouter as Router  } from 'react-router-dom';
//import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-react-router';
//import logo from './logo.svg';
//import './App.css';
//import {store,history} from './store';

import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/font.lato.css';
import './css/style.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
class App extends Component {
  render() {
    return (
        <Router>
          <div>
                <Route  exact path="/" component={Login}/>
                <Route path="/dashboard" component={Dashboard}  />
          </div>
        </Router>
    );
  }
}

export default App;
