import React, {Component} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Index from './components/Index/Index';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";

export default class App extends Component {

  state = {
    loggedIn: false,
    redirect: ""
  };

  successfullRegisterHandler = (_id, email) => {
    this.redirect("/login")
  };

  successfullLoginHandler = token => {
    localStorage.setItem('token', token);
    this.redirect("/")
  };

  logoutHandler = () => {
    localStorage.removeItem('token');
    this.redirect("/")
  };

  redirect = page => {
    this.setState({redirect: page});
    this.setState({redirect: ""});
  };

  render() {
    const state = this.state;

    const register = () => <RegisterForm registerSuccessfull={this.successfullRegisterHandler}/>;
    const login = () => <LoginForm loginSuccessfull={this.successfullLoginHandler}/>;
    const index = () => <Index classname="card"/>;

    return (
      <Router>

        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}

        <div className="App">
          <Navbar loggedIn={state.loggedIn} logout={this.logoutHandler}/>
          <div className="container mb-5 mt-5">
            <Route path="/" exact component={index}/>
            <Route path="/register/" exact component={register}/>
            <Route path="/login/" exact component={login}/>
          </div>
        </div>
      </Router>

    );
  }
};
