import React, {Component, Fragment} from 'react';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {NavLink as RouterLink} from "react-router-dom";
import 'flag-icon-css/css/flag-icon.min.css'

import LanguageContext from "../../context/languageContext";

export default class Navigation extends Component {
  static contextType = LanguageContext;

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  render() {
    const props = this.props;
    const style = {
      cursor: "pointer"
    };

    const text = {};

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        text.signIn = "Logga In";
        text.signup = "Registrera Dig";
        text.map = "Karta";
        text.myContacts = "Mina Kontakter";
        text.addContact = "Lägg Till Kontakt";
        text.logOut = "Logga Ut";
        text.flagIcon = "flag-icon-se";
        break;
      case "us":
        text.signIn = "Sign In";
        text.signup = "Sign Up";
        text.map = "Map";
        text.myContacts = "My Contacts";
        text.addContact = "Add Contact";
        text.logOut = "Log Out";
        text.flagIcon = "flag-icon-us"
    }

    return (
      <div>
        <Navbar className="App-Navbar" color="info" light expand="md" style={{padding: "15px"}}>
          <RouterLink exact to="/" className="nav-link text-white">
            <span className="Nav-Item">
              <b>Time For Friends</b>
            </span>
          </RouterLink>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            </Nav>
          </Collapse>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {!this.props.loggedIn ? <Fragment>
                <NavItem>
                  <RouterLink exact to="/login" className="nav-link text-white">
                    <span className="Nav-Item">{text.signIn}</span>
                  </RouterLink>
                </NavItem>
                <NavItem>
                  <RouterLink exact to="/register" className=" nav-link text-white">
                    <span className="Nav-Item">{text.signup}</span>
                  </RouterLink>
                </NavItem>
              </Fragment> : <Fragment>
                <NavItem>
                  <RouterLink exact to="/map" className="nav-link text-white">
                    <span className="Na v-Item">{text.map}</span>
                  </RouterLink>
                </NavItem>
                <NavItem>
                  <RouterLink exact to="/friends" className="nav-link text-white">
                    <span className="Nav-Item">{text.myContacts}</span>
                  </RouterLink>
                </NavItem>
                <NavItem>
                  <RouterLink exact to="/new-friend" className="nav-link text-white">
                    <span className="Nav-Item">{text.addContact}</span>
                  </RouterLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={props.logout} style={style} className="text-white">
                    <span className="Nav-Item">{text.logOut}</span>
                  </NavLink>
                </NavItem>
              </Fragment>}
              <NavItem>
                <span onClick={this.context.switchLanguage}
                      className={"flag-icon ml-md-2 flag-icon-squared " + text.flagIcon}
                      style={{"fontSize": "170%", cursor: "pointer", height: "100%"}}/>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};