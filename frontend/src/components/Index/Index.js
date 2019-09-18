import React from 'react'
import {Link} from "react-router-dom";
import {Button, Jumbotron} from 'reactstrap';
import '../../App.css'


const index = () => {

  return <div className="container">
    <Jumbotron className="Card" style={{backgroundColor: "rgba(0, 0, 0, 0.8)", paddingRight: "100px",
      paddingLeft: "100px"}}>
      <h1 className="display-3">Welcome!</h1>
      <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore. t enim ad minim veniam, quis nostrud exercitation !</p>
      <hr className="my-2"/>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.</p>
      <p className="lead">
        <Link to="/register">
          <Button color="info" size="lg" className="m-auto">Sign Up Now!</Button>
        </Link>
      </p>
    </Jumbotron>
  </div>
};

export default index;