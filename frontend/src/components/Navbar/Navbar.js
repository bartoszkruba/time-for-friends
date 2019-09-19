import React, {Component, Fragment} from 'react';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
import {Link} from "react-router-dom";


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
                    <span className="Nav-Item">Sign In</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/register" className=" nav-link text-white">
                    <span className="Nav-Item">Sign Up</span>
                  </Link>
                </NavItem>
              </Fragment> : <Fragment>
                <NavItem>
                  <Link to="/friends" className="nav-link text-white">
                    <span className="Nav-Item">My Contacts</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/new-friend" className="nav-link text-white">
                    <span className="Nav-Item">Add New Contact</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <NavLink onClick={props.logout} style={style} className="text-white">
                    <span className="Nav-Item">Log out</span>
                  </NavLink>
                </NavItem>
              </Fragment>}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};