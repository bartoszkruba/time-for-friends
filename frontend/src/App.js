import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Index from './components/Index/Index';
import NewFriendForm from "./components/NewFriendForm/NewFriendForm";
import FriendList from "./components/FriendList/FriendList";

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
    this.setState({loggedIn: true});
    this.redirect("/friend/new")
  };

  logoutHandler = async () => {
    localStorage.removeItem('token');
    await this.setState({loggedIn: false});
    this.redirect("/login/")
  };

  createdNewFriendHandler = () => {
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
    const newFriend = () => <NewFriendForm loggedIn={state.loggedIn} addedNewFriend={this.createdNewFriendHandler}/>;
    const friendList = () => <FriendList loggedIn={state.loggedIn}/>;

    return (
      <Router>

        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}

        <div className="App">
          <Navbar loggedIn={state.loggedIn} logout={this.logoutHandler}/>
          <div className="container mb-5 mt-5">
            <Route path="/" exact component={index}/>
            <Route path="/register/" exact component={register}/>
            <Route path="/login/" exact component={login}/>
            <Route path="/friend/new" exact component={newFriend}/>
            <Route path="/friend" exact component={friendList}/>
          </div>
        </div>
      </Router>

    );
  }
};
