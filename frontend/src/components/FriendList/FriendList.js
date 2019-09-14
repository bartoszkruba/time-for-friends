import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Table} from 'reactstrap';

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
      <div className="row mb-2">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <h1>My Friends</h1>
        </div>
        <div className="col-md-1"/>
      </div>
      <SearchBar/>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <Table dark>
            <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Timezone</th>
              <th>Current Time</th>
            </tr>
            </thead>
          </Table>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  }


};