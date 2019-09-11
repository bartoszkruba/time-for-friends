import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,} from 'reactstrap';

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
          <NavbarBrand className="text-white" href="/">Time For Friends</NavbarBrand>
          <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={props.showLoginForm} style={style} className="text-white">Log in</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={props.showRegisterForm} style={style} className="text-white">Register</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};