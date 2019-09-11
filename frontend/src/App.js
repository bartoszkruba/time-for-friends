import React, {Component, Fragment} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";

export default class App extends Component {

  state = {
    loggedIn: false,
    page: "register"
  };

  successfullRegisterHandler = (_id, email) => {
    console.log('success')
  };

  changeToRegisterHandler = () => {
    this.setState({page: "register"})
  };

  changeToLoginHandler = () => {
    this.setState({page: "login"})
  };

  render() {
    const state = this.state;
    let content;

    switch (state.page) {
      case "register":
        content = <RegisterForm registerSuccessfull={this.successfullRegisterHandler}/>
        break;
      case 'login':
        content = < LoginForm/>;
        break;
      default:
        content = null;
        break;
    }

    return (
      <Fragment>
        <Navbar showLoginForm={this.changeToLoginHandler} showRegisterForm={this.changeToRegisterHandler}
                loggedIn={state.loggedIn}/>
        <div className="container mt-5">
          {content}
        </div>
      </Fragment>

    );
  }
};
