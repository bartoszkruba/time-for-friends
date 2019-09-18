import React from 'react'
import {Button, Jumbotron} from 'reactstrap';
import '../../App.css'


const index = () => {

  return <Jumbotron className="Card" style={{backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
    <h1 className="display-3">Welcome!</h1>
    <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore. t enim ad minim veniam, quis nostrud exercitation !</p>
    <hr className="my-2"/>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur.</p>
    <p className="lead">
      <Button color="info" size="lg" className="m-auto">Join Now!</Button>
    </p>
  </Jumbotron>

  return <div className="container Card">
    <div className="row">
      <div className="col-md-2"/>
      <div className="col-md-8">
        <h1>Welcome!</h1>
      </div>
      <div className="col-md-2"/>
    </div>
    <div className="row">
      <div className="col-md-2"/>
      <div className="col-md-8">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.</p>
      </div>
      <div className="col-md-2"/>
    </div>
    <div className="row">
      <div className="col-md-2"/>
      <div className="col-md-8">
        <h1>Dasdsa sdaas</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.</p>
      </div>
      <div className="col-md-2"/>
    </div>
    <div className="row">
      <div className="col-md-2"/>
      <div className="col-md-8 text-center ">
        <Button color="info" size="lg" className="m-auto">Join Now!</Button>
      </div>
      <div className="col-md-2"/>
    </div>
  </div>


};

export default index;