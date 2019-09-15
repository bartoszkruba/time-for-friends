import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Table} from 'reactstrap';
import Clock from './Clock/Clock';

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    searchBar: {
      firstName: "",
      lastName: ""
    },
    redirect: "",
    friends: []
  };

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      if (!this.props.loggedIn) {
        return this.setState({redirect: "/login"});
      }
    }

    this.requestFriends(this.state.searchBar.firstName, this.state.searchBar.lastName);
  }

  requestFriends = async (firstName, lastName) => {
    try {
      const query = {
        firstName: `^${firstName}`,
        lastName: `^${lastName}`
      };
      const response = await graphqlService.friends(query);
      this.setState({friends: response.data.friends})
    } catch (e) {
      console.log(e);
    }
  };

  searchBarChangedHandler = e => {
    const searchBar = {...this.state.searchBar};
    searchBar[e.target.name] = e.target.value;
    this.setState({searchBar});
    this.requestFriends(searchBar.firstName, searchBar.lastName)
  };

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
      <SearchBar formChanged={this.searchBarChangedHandler} firstName={state.searchBar.firstName}
                 lastName={state.searchBar.lastName}/>
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