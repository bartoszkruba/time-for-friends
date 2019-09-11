import React, {Component, Fragment} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";

export default class App extends Component {

  successfullRegisterHandler = (_id, email) => {
    console.log('success')
  };

  render() {
    return (
      <Fragment>
        <Navbar/>
        <div className="container mt-5">
          <RegisterForm registerSuccessfull={this.successfullRegisterHandler}/>
        </div>
      </Fragment>

    );
  }
};
