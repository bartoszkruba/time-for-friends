import React from 'react'
import {Link} from "react-router-dom";
import {Button, Jumbotron} from 'reactstrap';
import '../../App.css'


const index = () => {

  return <div className="container">
    <Jumbotron className="Card" style={{
      backgroundColor: "rgba(0, 0, 0, 0.8)", paddingRight: "100px",
      paddingLeft: "100px"
    }}>
      <h1 className="display-3">Welcome!</h1>
      <p className="lead">"Time For Friends" is an web application that allows you to track your friends local time live.
        You can enter as many persons with different timezones as you want and we will track their local time for you
        totally for free.</p>
      <hr className="my-2"/>
      <p className="lead">
        <Link to="/register">
          <Button color="info" size="lg" className="m-auto">Sign Up Now!</Button>
        </Link>
      </p>
    </Jumbotron>
  </div>
};

export default index;