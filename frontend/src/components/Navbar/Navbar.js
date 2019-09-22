import React, {Component, Fragment} from 'react';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {Link} from "react-router-dom";
import 'flag-icon-css/css/flag-icon.min.css'


export default class Navigation extends Component {
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
    switch (this.props.language) {
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
          <Link to="/" className="nav-link text-white">
            <span className="Nav-Item">
              <b>Time For Friends</b>
            </span>
          </Link>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            </Nav>
          </Collapse>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {!this.props.loggedIn ? <Fragment>
                <NavItem>
                  <Link to="/login" className="nav-link text-white">
                    <span className="Nav-Item">{text.signIn}</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/register" className=" nav-link text-white">
                    <span className="Nav-Item">{text.signup}</span>
                  </Link>
                </NavItem>
              </Fragment> : <Fragment>
                <NavItem>
                  <Link to="/map" className="nav-link text-white">
                    <span className="Nav-Item">{text.map}</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/friends" className="nav-link text-white">
                    <span className="Nav-Item">{text.myContacts}</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/new-friend" className="nav-link text-white">
                    <span className="Nav-Item">{text.addContact}</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <NavLink onClick={props.logout} style={style} className="text-white">
                    <span className="Nav-Item">{text.logOut}</span>
                  </NavLink>
                </NavItem>
              </Fragment>}
              <NavItem>
                <span onClick={props.switchLanguage} className={"flag-icon ml-md-2 flag-icon-squared " + text.flagIcon}
                      style={{"font-size": "170%", cursor: "pointer", height: "100%"}}/>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};