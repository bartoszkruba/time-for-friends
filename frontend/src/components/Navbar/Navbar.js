import React, {Component, Fragment} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';
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
          <Link to="/" style={{"text-decoration": "none"}}>
            <NavbarBrand className="text-white" style={style}><b>Time For Friends</b></NavbarBrand>
          </Link>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {!this.props.loggedIn ? <Fragment>
                <NavItem>
                  <Link to="/login">
                    <NavLink style={style} className="text-white">Log in</NavLink>
                  </Link>
                </NavItem>
                <Link to="/register">
                  <NavItem>
                    <NavLink style={style} className="text-white">Register</NavLink>
                  </NavItem>
                </Link>
              </Fragment> : <NavItem>
                <NavLink onClick={props.logout} style={style} className="text-white">Log out</NavLink>
              </NavItem>}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};