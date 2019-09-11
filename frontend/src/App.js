import React, {Component, Fragment} from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Navbar/>
        <div className="container mt-5">
          <RegisterForm/>
        </div>
      </Fragment>

    );
  }
};
