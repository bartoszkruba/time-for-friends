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
        <Navbar color="info" light expand="md">
          <Link to="/" className="nav-link Nav-Item text-white">
            <b>Time For Friends</b>
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
                  <Link to="/login" className="Nav-Item nav-link text-white">Log in</Link>
                </NavItem>
                <NavItem>
                  <Link to="/register" className="Nav-Item nav-link text-white">Sign Up</Link>
                </NavItem>
              </Fragment> : <Fragment>
                <NavItem>
                  <Link to="/friend" className="Nav-Item nav-link text-white">My Contact</Link>
                </NavItem>
                <NavItem>
                  <Link to="/friend/new" className="Nav-Item nav-link text-white">Add New Contact</Link>
                </NavItem>
                <NavItem>
                  <NavLink onClick={props.logout} style={style} className="Nav-Item text-white">Log out</NavLink>
                </NavItem>
              </Fragment>}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};