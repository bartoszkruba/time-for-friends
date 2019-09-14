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
          <Link to="/" style={{"textDecoration": "none"}}>
            <NavbarBrand className="text-white" style={style}><b>Time For Friends</b></NavbarBrand>
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
                  <Link to="/login">
                    <NavLink to="/login" style={style} className="text-white">Log in</NavLink>
                  </Link>
                </NavItem>
                <Link to="/register">
                  <NavItem>
                    <NavLink style={style} className="text-white">Register</NavLink>
                  </NavItem>
                </Link>
              </Fragment> : <Fragment>
                <NavItem>
                  <Link to="/friend">
                    <NavLink style={style} className="text-white">My Friends</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/friend/new">
                    <NavLink style={style} className="text-white">Add New Friend</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <NavLink onClick={props.logout} style={style} className="text-white">Log out</NavLink>
                </NavItem>
              </Fragment>}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

};