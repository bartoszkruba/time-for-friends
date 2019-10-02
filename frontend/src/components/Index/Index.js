import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {Button, Jumbotron} from 'reactstrap';
import '../../App.css'
import LanguageContext from "../../context/languageContext";

export default class Index extends Component {

  static contextType = LanguageContext;

  render() {
    const text = {};

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        text.welcome = "Välkommen!";
        text.button = "Registrera Dig Nu!";
        text.lead = `"Time For Friends" är en webbapplikation som låter dig spåra dina vänners lokala tider.
        Du kan ange så många personer med olika tidszoner som du vill och vi kommer spåra deras lokala tid åt dig helt gratis.`;
        break;
      case "us":
        text.welcome = "Welcome!";
        text.button = "Sign Up Now!";
        text.lead = `"Time For Friends" is a web application that allows you to track your friends local time live.
      You can enter as many people with different time zones as you want and we will track their local time for you 
      totally for free.`;
    }

    return <div className="container">
      <Jumbotron className="Index-Jumbotron" style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      }}>
        <h1 className="display-3">{text.welcome}</h1>
        <p className="lead">{text.lead}</p>
        <hr className="my-2"/>
        <p className="lead">
          {!this.props.loggedIn && <Link to="/register">
            <Button color="info" size="lg" className="m-auto">{text.button}</Button>
          </Link>}
        </p>
      </Jumbotron>
    </div>
  }
}