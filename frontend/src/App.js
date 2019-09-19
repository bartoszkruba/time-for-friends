import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Index from './components/Index/Index';
import NewFriendForm from "./components/NewFriendForm/NewFriendForm";
import FriendList from "./components/FriendList/FriendList";
import Friend from "./components/Friend/Friend";
import graphqlService from "./graphql/graphqlService";

export default class App extends Component {

  state = {
    loggedIn: true,
    redirect: ""
  };

  async componentDidMount() {
    try {
      const response = await graphqlService.isAuthenticated();
      this.setState({loggedIn: response.data.isAuthenticated})
    } catch (e) {
      console.log(e);
      this.setState({loggedIn: false});
    }
  }

  successfullRegisterHandler = (_id, email) => {
    this.redirect("/login")
  };

  successfullLoginHandler = token => {
    localStorage.setItem('token', token);
    this.setState({loggedIn: true});
    this.redirect("/friends")
  };

  logoutHandler = async () => {
    localStorage.removeItem('token');
    await this.setState({loggedIn: false});
    this.redirect("/")
  };

  createdNewFriendHandler = () => {
    this.redirect("/friends")
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
    const friend = ({match}) => {
      return <Friend _id={match.params.id}/>;
    };

    return (
      <Router>

        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}

        <div className="App">
          <Navbar loggedIn={state.loggedIn} logout={this.logoutHandler}/>
          <div className="top-margin">
            <Route path="/" exact component={index}/>
            <Route path="/register/" exact component={register}/>
            <Route path="/login/" exact component={login}/>
            <Route path="/new-friend" exact component={newFriend}/>
            <Route path="/friends" exact component={friendList}/>
            <Route path="/friend/:id" exact component={friend}/>
          </div>
        </div>
      </Router>

    );
  }
};
