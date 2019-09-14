import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Table} from 'reactstrap';
import Clock from './Clock/Clock';

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    redirect: "",
    friends: []
  };

  async componentDidMount() {
    if (!this.props.isLoggedIn) {
      if (!this.props.loggedIn) {
        return this.setState({redirect: "/login"});
      }
    }

    try {
      const response = await graphqlService.friends();
      this.setState({friends: response.data.friends})
    } catch (e) {
      console.log(e);
    }

  }

  render() {
    const state = this.state;

    const rows = state.friends.map(f => <tr key={f._id}>
      <td>{f.firstName}</td>
      <td>{f.lastName}</td>
      <td>{f.city}</td>
      <td>{f.country}</td>
      <td>{f.timezone.name}</td>
      <td><Clock timezone={f.timezone.name}/></td>
    </tr>);

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
            <tbody>
            {rows}
            </tbody>
          </Table>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  }


};