import React, {Component} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Index from './components/Index/Index';

export default class App extends Component {

  state = {
    loggedIn: false,
    page: "index"
  };

  successfullRegisterHandler = (_id, email) => {
    this.setState({page: "login"})
  };

  successfullLoginHandler = token => {
    localStorage.setItem('token', token);
    this.setState({loggedIn: true, page: "index"})
  };

  changeToRegisterHandler = () => {
    this.setState({page: "register"})
  };

  changeToLoginHandler = () => {
    this.setState({page: "login"})
  };

  changeToIndexHandler = () => {
    this.setState({page: "index"})
  };

  logoutHandler = () => {
    localStorage.removeItem('token');
    this.setState({loggedIn: false, page: "index"})
  };

  render() {
    const state = this.state;
    let content;

    switch (state.page) {
      case "register":
        content = <RegisterForm registerSuccessfull={this.successfullRegisterHandler}/>
        break;
      case 'login':
        content = < LoginForm loginSuccessfull={this.successfullLoginHandler}/>;
        break;
      case 'index':
        content = <Index classname="card"/>;
        break;
      default:
        content = null;
        break;
    }

    return (
      <div className="App">
        <Navbar showIndex={this.changeToIndexHandler} logout={this.logoutHandler}
                showLoginForm={this.changeToLoginHandler}
                showRegisterForm={this.changeToRegisterHandler}
                loggedIn={state.loggedIn}/>
        <div className="container mb-5 mt-5">
          {content}
        </div>
      </div>

    );
  }
};
