import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Table} from 'reactstrap';
import DateCounter from './Date/Date'
import moment from 'moment-timezone'

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    searchBar: {
      firstName: "",
      lastName: "",
      range: [new Date(), new Date()],
      betweenSwitch: false,
      betweenSwitchLabel: "Off",
      sortingSwitch: false,
      sortingSwitchLabel: "First Name"
    },
    redirect: "",
    friends: []
  };

  async componentDidMount() {
    if (!this.props.isLoggedIn) {
      if (!this.props.loggedIn) {
        return this.setState({redirect: "/login"});
      }
    }

    await this.setState({_isMounted: true});
    this.requestFriends(this.state.searchBar.firstName, this.state.searchBar.lastName);
    this.calculateTimes();
  }

  componentWillUnmount() {
    this.setState({_isMounted: false})
  }

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  calculateTimes = async () => {
    while (this.state._isMounted) {
      const friends = [...this.state.friends].map(f => {
        f.currentTime = moment.tz(f.timezone.name).format('HH:mm:ss');
        return f;
      });
      this.setState(friends);
      await this.sleep(500);
    }
  };

  requestFriends = async () => {
    const state = this.state.searchBar;
    try {
      const query = {
        firstName: `^${state.firstName}`,
        lastName: `^${state.lastName}`
      };

      query.sort = state.sortingSwitch ? "country" : "firstName";

      if (state.range && state.range[0] && state.range[1] && state.betweenSwitch) {
        query.from = moment(state.range[0]).format("YYYYMMDDHHmmss");
        query.to = moment(state.range[1]).format("YYYYMMDDHHmmss");
      }
      const response = await graphqlService.friends(query);
      this.setState({friends: response.data.friends})
    } catch (e) {
      console.log(e);
    }
  };

  searchBarChangedHandler = async e => {
    const searchBar = {...this.state.searchBar};
    if (e.target.name === "betweenSwitch") {
      searchBar.betweenSwitchLabel = searchBar.betweenSwitch ? "Off" : "On";
      searchBar.betweenSwitch = !searchBar.betweenSwitch;
    } else {
      searchBar[e.target.name] = e.target.value;
    }

    await this.setState({searchBar});
    this.requestFriends()
  };

  rangeChangedHandler = async range => {
    const searchBar = {...this.state.searchBar};
    searchBar.range = range;
    await this.setState({searchBar});
    this.requestFriends();
  };

  sortingChangeHandler = async e => {
    const searchBar = {...this.state.searchBar};
    searchBar.sortingSwitch = !searchBar.sortingSwitch;
    searchBar.sortingSwitchLabel = searchBar.sortingSwitch ? "Country" : "First Name";
    await this.setState({searchBar});
    this.requestFriends();
  };

  render() {
    const state = this.state;
    const rows = state.friends.map(f => <tr key={f._id}>
      <td>{f.firstName}</td>
      <td>{f.lastName}</td>
      <td>{f.city}</td>
      <td>{f.country}</td>
      <td><DateCounter timezone={f.timezone.name}/></td>
      <td><span className="Time">{f.currentTime ? f.currentTime : "--:--:--"}</span></td>
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
      <SearchBar rangeChanged={this.rangeChangedHandler} formChanged={this.searchBarChangedHandler}
                 sortingChanged={this.sortingChangeHandler}
                 betweenSwtich={state.searchBar.betweenSwitch}
                 betweenSwtichLabel={state.searchBar.betweenSwitchLabel}
                 sortingSwitch={state.searchBar.sortingSwitch}
                 sortingSwitchLabel={state.searchBar.sortingSwitchLabel}
                 range={state.searchBar.range}
                 firstName={state.searchBar.firstName}
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
              <th>Current Date</th>
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