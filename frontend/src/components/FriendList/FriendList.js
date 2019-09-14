import React, {Component} from 'react';
import {Redirect} from "react-router-dom";


export default class FriendList extends Component {

  state = {
    redirect: ""
  };

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      if (!this.props.loggedIn) {
        return this.setState({redirect: "/login"});
      }
    }
  }

  render() {
    const state = this.state;

    return <div className="container Card">
      {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1>My Friends</h1>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }


};