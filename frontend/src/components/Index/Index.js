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
};

export default index;